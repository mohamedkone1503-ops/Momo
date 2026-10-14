import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getBarber } from "@/data/barbers";
import { totals } from "@/data/services";
import { isAdmin } from "@/lib/auth";
import { listBlocks, listReservations, type Reservation } from "@/lib/reservations";
import { addDays, fmtTime, formatDateFr, parisNow } from "@/lib/time";
import { cancel, logout, remove, unblock } from "./actions";
import { BlockForm } from "./BlockForm";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

const VIEWS = [
  { key: "jour", label: "Aujourd'hui" },
  { key: "semaine", label: "7 jours" },
  { key: "a-venir", label: "Tout à venir" },
  { key: "passes", label: "Passés" },
] as const;

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ vue?: string }> }) {
  if (!(await isAdmin())) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-lg border border-ink-line bg-ink-soft p-8">
          <Logo />
          <h1 className="mt-6 font-display text-3xl">Espace admin</h1>
          {!process.env.ADMIN_PASSWORD && (
            <p className="mt-4 text-sm text-amber-300">ADMIN_PASSWORD n'est pas défini (voir .env.example).</p>
          )}
          <LoginForm />
        </div>
      </main>
    );
  }

  const { vue = "jour" } = await searchParams;
  const today = parisNow().date;
  const weekEnd = addDays(today, 6);
  const [all, blocks] = await Promise.all([listReservations(), listBlocks()]);
  all.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const shown = all.filter((r) =>
    vue === "jour" ? r.date === today
    : vue === "semaine" ? r.date >= today && r.date <= weekEnd
    : vue === "passes" ? r.date < today
    : r.date >= today
  );
  if (vue === "passes") shown.reverse();

  const active = (r: Reservation) => r.status !== "annulee";
  const stats = [
    { label: "Aujourd'hui", value: all.filter((r) => r.date === today && active(r)).length },
    { label: "Cette semaine", value: all.filter((r) => r.date >= today && r.date <= weekEnd && active(r)).length },
    {
      label: "CA prévu semaine",
      value: `${all.filter((r) => r.date >= today && r.date <= weekEnd && active(r)).reduce((n, r) => n + totals(r.serviceId, r.extraIds).price, 0)} €`,
    },
  ];

  const byDate = new Map<string, Reservation[]>();
  for (const r of shown) byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]);
  const upcomingBlocks = blocks.filter((b) => b.date >= today);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="pt-2"><Logo /></Link>
        <form action={logout}>
          <button className="text-xs font-bold uppercase tracking-[0.15em] text-muted hover:text-cream">Déconnexion</button>
        </form>
      </div>

      <h1 className="mt-10 font-display text-4xl">Rendez-vous</h1>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-ink-line bg-ink-soft p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{s.label}</p>
            <p className="mt-1 font-display text-2xl text-gold md:text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 text-sm" aria-label="Période">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={`/admin?vue=${v.key}`}
            aria-current={vue === v.key ? "page" : undefined}
            className={`rounded-[6px] border px-4 py-2 ${vue === v.key ? "border-gold bg-gold font-semibold text-ink" : "border-ink-line hover:border-cream/40"}`}
          >
            {v.label}
          </Link>
        ))}
      </nav>

      {shown.length === 0 && <p className="mt-10 text-muted">Aucun rendez-vous sur cette période.</p>}

      {[...byDate].map(([date, list]) => (
        <section key={date} className="mt-10">
          <h2 className="border-b border-ink-line pb-2 text-sm font-bold uppercase tracking-[0.2em] text-gold">
            {formatDateFr(date)}{date === today && " · aujourd'hui"}
            <span className="ml-2 font-normal normal-case tracking-normal text-muted">({list.filter(active).length} RDV)</span>
          </h2>
          <ul className="divide-y divide-ink-line">
            {list.map((r) => {
              const t = totals(r.serviceId, r.extraIds);
              const barber = getBarber(r.barberId)?.name ?? r.barberId;
              return (
                <li key={r.id} className={`flex flex-col gap-3 py-4 md:flex-row md:items-center ${active(r) ? "" : "opacity-50"}`}>
                  <p className="w-20 font-display text-2xl">{fmtTime(r.time)}</p>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {r.firstName} {r.lastName}
                      {!active(r) && <span className="ml-3 rounded-full border border-barber-red/60 px-2 py-0.5 text-[11px] text-red-300">Annulé</span>}
                    </p>
                    <p className="text-sm text-muted">
                      {t.label} · {t.duration} min · <span className="text-gold">{t.price} €</span> · {barber}
                      {!r.requestedBarberId && " (peu importe)"}
                    </p>
                    <p className="text-sm">
                      <a href={`tel:${r.phone}`} className="hover:text-gold">{r.phone}</a> ·{" "}
                      <a href={`mailto:${r.email}`} className="text-muted hover:text-gold">{r.email}</a>
                    </p>
                    {r.message && <p className="mt-1 text-sm italic text-cream/70">« {r.message} »</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {active(r) && (
                      <form action={cancel} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={r.id} />
                        <label className="flex items-center gap-1 text-xs text-muted">
                          <input type="checkbox" name="notify" defaultChecked className="accent-[#c9a35b]" /> prévenir
                        </label>
                        <button className="rounded-[6px] border border-ink-line px-3 py-1.5 text-xs hover:border-cream/40">Annuler</button>
                      </form>
                    )}
                    <form action={remove}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="rounded-[6px] border border-barber-red/50 px-3 py-1.5 text-xs text-red-300 hover:bg-barber-red/10">Supprimer</button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="mt-16">
        <h2 className="font-display text-3xl">Bloquer des créneaux</h2>
        <p className="mt-1 text-sm text-muted">Congés, pause, formation… Les créneaux bloqués ne sont plus réservables.</p>
        <div className="mt-5"><BlockForm today={today} /></div>
        {upcomingBlocks.length > 0 && (
          <ul className="mt-5 divide-y divide-ink-line rounded-lg border border-ink-line">
            {upcomingBlocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span>
                  <span className="font-semibold first-letter:uppercase">{formatDateFr(b.date)}</span>{" "}
                  · {b.start === "00:00" && b.end === "23:59" ? "journée entière" : `${fmtTime(b.start)} – ${fmtTime(b.end)}`}
                  {" "}· {b.barberId ? getBarber(b.barberId)?.name : "tout le salon"}
                  <span className="text-muted"> · {b.reason}</span>
                </span>
                <form action={unblock}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="text-xs text-muted hover:text-cream">Débloquer</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
