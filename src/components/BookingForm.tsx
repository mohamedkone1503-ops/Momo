"use client";

import { useEffect, useState } from "react";
import { content } from "@/data/content";
import { services } from "@/data/services";

type Day = { date: string; label: string; weekday: string; month: string; closed: boolean };

const input =
  "w-full rounded-xl border border-ink-line bg-ink px-4 py-3.5 text-cream placeholder:text-muted/60 focus:border-gold focus:outline-none";
const label = "mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gold";

export function BookingForm({ days, initialService }: { days: Day[]; initialService?: string }) {
  const [serviceId, setServiceId] = useState(
    services.some((s) => s.id === initialService) ? initialService! : services[0].id
  );
  const [date, setDate] = useState(days.find((d) => !d.closed)?.date ?? "");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setSlots(null);
    setTime("");
    fetch(`/api/slots?date=${date}&service=${serviceId}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setSlots(d.slots ?? []))
      .catch(() => !cancelled && setSlots([]));
    return () => {
      cancelled = true;
    };
  }, [date, serviceId, reload]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!time) return setError("Merci de choisir un horaire.");
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(form), serviceId, date, time }),
    }).catch(() => null);
    if (res?.ok) return setStatus("done");
    const data = await res?.json().catch(() => null);
    setError(data?.error ?? "Une erreur est survenue. Réessayez ou appelez-nous.");
    setStatus("idle");
    if (res?.status === 409) setReload((n) => n + 1); // recharge les créneaux
  }

  if (status === "done") {
    const s = services.find((x) => x.id === serviceId)!;
    const d = days.find((x) => x.date === date)!;
    return (
      <div className="rounded-2xl border border-gold/40 bg-ink-soft p-8 text-center" role="status">
        <p className="font-display text-3xl text-gold">C'est noté !</p>
        <p className="mt-4 text-cream/85">{content.booking.success}</p>
        <p className="mt-6 text-sm text-muted">
          {s.name} · {d.weekday} {d.label} à {time.replace(":", "h")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <fieldset className="min-w-0">
        <legend className={label}>1. Prestation</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <label
              key={s.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 transition ${
                serviceId === s.id ? "border-gold bg-gold/10" : "border-ink-line hover:border-cream/40"
              }`}
            >
              <input type="radio" name="service" value={s.id} checked={serviceId === s.id} onChange={() => setServiceId(s.id)} className="sr-only" />
              <span>
                <span className="block font-semibold">{s.name}</span>
                <span className="text-xs text-muted">{s.duration} min</span>
              </span>
              <span className="font-display text-xl text-gold">{s.price} €</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className={label}>2. Date</legend>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {days.map((d) => (
            <button
              key={d.date}
              type="button"
              disabled={d.closed}
              onClick={() => setDate(d.date)}
              aria-pressed={date === d.date}
              className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-30 ${
                date === d.date ? "border-gold bg-gold text-ink" : "border-ink-line hover:border-cream/40"
              }`}
            >
              <span className="text-[11px] uppercase">{d.weekday.slice(0, 3)}</span>
              <span className="text-xl font-bold">{d.label.split(" ")[0]}</span>
              <span className="text-[11px]">{d.month}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className={label}>3. Horaire</legend>
        {slots === null ? (
          <p className="text-sm text-muted">Chargement des créneaux…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted">Aucun créneau disponible ce jour-là. Essayez une autre date.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {slots.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                aria-pressed={time === t}
                className={`rounded-lg border py-2.5 text-sm font-semibold transition ${
                  time === t ? "border-gold bg-gold text-ink" : "border-ink-line hover:border-cream/40"
                }`}
              >
                {t.replace(":", "h")}
              </button>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="grid min-w-0 gap-5 sm:grid-cols-2">
        <legend className={label}>4. Vos coordonnées</legend>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm">Nom et prénom *</label>
          <input id="name" name="name" required minLength={2} autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm">Téléphone *</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className={input} placeholder="06 12 34 56 78" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-sm">E-mail (facultatif)</label>
          <input id="email" name="email" type="email" autoComplete="email" className={input} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="note" className="mb-1.5 block text-sm">Précisions (facultatif)</label>
          <textarea id="note" name="note" rows={3} maxLength={500} className={input} placeholder="Coupe souhaitée, barbier préféré…" />
        </div>
        {/* Champ piège anti-spam, invisible pour les humains */}
        <div className="hidden" aria-hidden>
          <label htmlFor="website">Site web</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>

      {error && <p className="rounded-xl border border-barber-red/50 bg-barber-red/10 px-4 py-3 text-sm" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-gold py-4 text-sm font-bold uppercase tracking-[0.15em] text-ink hover:bg-gold-light disabled:opacity-60"
      >
        {status === "sending" ? "Envoi…" : "Confirmer la demande"}
      </button>
      <p className="text-center text-xs text-muted">
        Vos données servent uniquement à gérer votre rendez-vous.
      </p>
    </form>
  );
}
