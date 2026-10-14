import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getService } from "@/data/services";
import { isAdmin } from "@/lib/auth";
import { listReservations, type Reservation } from "@/lib/reservations";
import { formatDateFr, parisNow } from "@/lib/time";
import { logout, remove, setStatus } from "./actions";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

const statusLabel: Record<Reservation["status"], { text: string; cls: string }> = {
  en_attente: { text: "En attente", cls: "border-amber-400/50 text-amber-300" },
  confirmee: { text: "Confirmée", cls: "border-emerald-400/50 text-emerald-300" },
  annulee: { text: "Annulée", cls: "border-barber-red/60 text-red-300" },
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ vue?: string }> }) {
  if (!(await isAdmin())) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-3xl border border-ink-line bg-ink-soft p-8">
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

  const { vue = "a-venir" } = await searchParams;
  const today = parisNow().date;
  const all = (await listReservations()).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = all.filter((r) => r.date >= today);
  const past = all.filter((r) => r.date < today).reverse();
  const shown = vue === "passees" ? past : upcoming;

  const byDate = new Map<string, Reservation[]>();
  for (const r of shown) byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]);

  const pending = upcoming.filter((r) => r.status === "en_attente").length;
  const todayCount = upcoming.filter((r) => r.date === today && r.status !== "annulee").length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <form action={logout}>
          <button className="text-xs font-bold uppercase tracking-[0.15em] text-muted hover:text-cream">Déconnexion</button>
        </form>
      </div>

      <h1 className="mt-10 font-display text-4xl">Réservations</h1>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Aujourd'hui", todayCount],
          ["À confirmer", pending],
          ["À venir", upcoming.filter((r) => r.status !== "annulee").length],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-ink-line bg-ink-soft p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">{l}</p>
            <p className="mt-1 font-display text-3xl text-gold">{v}</p>
          </div>
        ))}
      </div>

      <nav className="mt-8 flex gap-2 text-sm">
        {[["a-venir", "À venir"], ["passees", "Passées"]].map(([k, l]) => (
          <Link
            key={k}
            href={`/admin?vue=${k}`}
            className={`rounded-full border px-4 py-2 ${vue === k ? "border-gold bg-gold text-ink" : "border-ink-line"}`}
          >
            {l}
          </Link>
        ))}
      </nav>

      {shown.length === 0 && <p className="mt-10 text-muted">Aucune réservation.</p>}

      {[...byDate].map(([date, list]) => (
        <section key={date} className="mt-10">
          <h2 className="border-b border-ink-line pb-2 text-sm font-bold uppercase tracking-[0.2em] text-gold">
            {formatDateFr(date)}{date === today && " · aujourd'hui"}
          </h2>
          <ul className="divide-y divide-ink-line">
            {list.map((r) => {
              const s = getService(r.serviceId);
              const st = statusLabel[r.status];
              return (
                <li key={r.id} className={`flex flex-col gap-3 py-4 md:flex-row md:items-center ${r.status === "annulee" ? "opacity-50" : ""}`}>
                  <p className="w-16 font-display text-2xl">{r.time.replace(":", "h")}</p>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {r.name}
                      <span className={`ml-3 rounded-full border px-2 py-0.5 text-[11px] ${st.cls}`}>{st.text}</span>
                    </p>
                    <p className="text-sm text-muted">
                      {s?.name ?? r.serviceId} · {s?.price} € ·{" "}
                      <a href={`tel:${r.phone}`} className="text-cream hover:text-gold">{r.phone}</a>
                      {r.email && <> · <a href={`mailto:${r.email}`} className="hover:text-gold">{r.email}</a></>}
                    </p>
                    {r.note && <p className="mt-1 text-sm italic text-cream/70">« {r.note} »</p>}
                  </div>
                  <div className="flex gap-2">
                    {r.status !== "confirmee" && (
                      <form action={setStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="confirmee" />
                        <button className="rounded-full border border-emerald-400/50 px-3 py-1.5 text-xs hover:bg-emerald-400/10">Confirmer</button>
                      </form>
                    )}
                    {r.status !== "annulee" && (
                      <form action={setStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="annulee" />
                        <button className="rounded-full border border-ink-line px-3 py-1.5 text-xs hover:border-cream/40">Annuler</button>
                      </form>
                    )}
                    <form action={remove}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="rounded-full border border-barber-red/50 px-3 py-1.5 text-xs text-red-300 hover:bg-barber-red/10">Supprimer</button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
