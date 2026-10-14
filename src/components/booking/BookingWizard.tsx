"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { barbers, getBarber } from "@/data/barbers";
import { bookingConfig } from "@/data/booking";
import { content } from "@/data/content";
import { extraServices, mainServices, totals } from "@/data/services";
import { site } from "@/data/site";
import { buildIcs } from "@/lib/ics";
import { fmtTime, formatDateFr } from "@/lib/time";
import { Loader } from "../Decor";
import { CalendarIcon } from "../Icons";
import { Tbc } from "../Tbc";
import { Calendar } from "./Calendar";

type Slot = { time: string; available: boolean };
const t = content.booking;

const card = (active: boolean, align = "text-left") =>
  `w-full rounded-lg border px-4 py-4 ${align} transition-colors ${
    active ? "border-gold bg-gold/10" : "border-ink-line bg-ink hover:border-cream/40"
  }`;
const field =
  "w-full rounded-[6px] border border-ink-line bg-ink px-4 py-3.5 text-cream placeholder:text-muted/60 focus:border-gold focus:outline-none";

export function BookingWizard({ today, closedDays, initialService }: { today: string; closedDays: number[]; initialService?: string }) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(mainServices.find((s) => s.id === initialService)?.id ?? "");
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [reload, setReload] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ id: string; barberId: string; emailSent: boolean } | null>(null);

  const total = useMemo(() => (serviceId ? totals(serviceId, extraIds) : null), [serviceId, extraIds]);

  useEffect(() => {
    if (!date || !serviceId) return;
    let cancelled = false;
    setSlots(null);
    const q = new URLSearchParams({ date, service: serviceId, barber: barberId ?? "", extras: extraIds.join(",") });
    fetch(`/api/slots?${q}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setSlots(d.slots ?? []);
        setTime((cur) => (d.slots ?? []).some((s: Slot) => s.time === cur && s.available) ? cur : "");
      })
      .catch(() => !cancelled && setSlots([]));
    return () => {
      cancelled = true;
    };
  }, [date, serviceId, barberId, extraIds, reload]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, done]);

  const canGo = [!!serviceId, true, !!date && !!time, true];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSending(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, consent: f.consent === "on", serviceId, extraIds, barberId, date, time }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setSending(false);
    if (res?.ok && data?.id) return setDone(data);
    setError(data?.error ?? "Une erreur est survenue. Réessaie ou appelle-nous.");
    if (res?.status === 409) {
      setReload((n) => n + 1);
      setStep(2);
    }
  }

  function downloadIcs() {
    if (!done || !total) return;
    const ics = buildIcs({ id: done.id, date, time, duration: total.duration, title: total.label });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "rendez-vous-flex-hairstyle.ics" });
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Confirmation ----------
  if (done && total) {
    const b = getBarber(done.barberId);
    return (
      <div className="text-center" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-3xl text-gold">✓</span>
        <h2 className="mt-6 font-display text-3xl font-semibold md:text-4xl">C'est réservé !</h2>
        <p className="mt-3 text-muted">{done.emailSent ? t.emailSent : t.emailNotSent}</p>
        <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-lg border border-ink-line bg-ink p-6 text-left text-sm">
          <Row label="Prestation" value={total.label} />
          <Row label="Date" value={`${formatDateFr(date)} à ${fmtTime(time)}`} />
          <Row label="Coiffeur" value={barberId ? b?.name ?? "" : `${t.anyBarber} (${b?.name ?? ""})`} />
          <Row label="Durée" value={`${total.duration} min`} />
          <Row label="Prix" value={`${total.price} €`} gold />
          <Row label="Adresse" value={`${site.address.street}, Paris 10e`} />
        </dl>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={downloadIcs} className="btn-gold">
            <CalendarIcon className="h-4 w-4" />
            Ajouter à mon agenda
          </button>
          <Link href="/" className="btn-outline">Retour à l'accueil</Link>
        </div>
        <p className="mx-auto mt-8 max-w-md text-xs text-muted">{bookingConfig.rules}</p>
      </div>
    );
  }

  return (
    <div>
      <Progress step={step} onGo={(i) => i < step && setStep(i)} />

      {error && (
        <p className="mt-6 rounded-[6px] border border-barber-red/60 bg-barber-red/10 px-4 py-3 text-sm" role="alert">{error}</p>
      )}

      <div className="mt-8">
        {/* 1. Prestation */}
        {step === 0 && (
          <fieldset className="min-w-0">
            <legend className="font-display text-2xl">Quelle prestation ?</legend>
            <div className="mt-5 grid gap-3">
              {mainServices.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={serviceId === s.id}
                  onClick={() => {
                    setServiceId(s.id);
                    if (extraServices.length === 0) setStep(1);
                  }}
                  className={card(serviceId === s.id)}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block font-semibold">{s.name}</span>
                      <span className="text-xs text-muted">{s.duration} min</span>
                    </span>
                    <span className="font-display text-xl text-gold">{s.price} €</span>
                  </span>
                </button>
              ))}
            </div>
            {extraServices.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted">En supplément :</p>
                {extraServices.map((x) => {
                  const on = extraIds.includes(x.id);
                  return (
                    <label key={x.id} className={`mt-2 flex cursor-pointer items-center gap-3 ${card(on)}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setExtraIds((l) => (on ? l.filter((i) => i !== x.id) : [...l, x.id]))}
                        className="h-5 w-5 accent-[#c9a35b]"
                      />
                      <span className="flex-1">
                        <span className="block font-semibold">{x.name}</span>
                        <span className="text-xs text-muted">+{x.duration} min</span>
                      </span>
                      <span className="font-display text-lg text-gold">+{x.price} €</span>
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>
        )}

        {/* 2. Coiffeur */}
        {step === 1 && (
          <fieldset className="min-w-0">
            <legend className="font-display text-2xl">Avec qui ?</legend>
            <p className="mt-1 text-sm text-muted">Facultatif : on te place avec le premier coiffeur disponible.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[{ id: null, name: t.anyBarber, specialty: "Premier disponible", photo: null, aConfirmer: false }, ...barbers].map((b) => (
                <button
                  key={b.id ?? "any"}
                  type="button"
                  aria-pressed={barberId === b.id}
                  onClick={() => {
                    setBarberId(b.id);
                    setStep(2);
                  }}
                  className={`${card(barberId === b.id, "text-center")} flex flex-col items-center`}
                >
                  <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-ink-soft font-display text-2xl text-gold">
                    {b.photo ? <Image src={b.photo} alt="" fill sizes="64px" className="object-cover" /> : b.id ? b.name.charAt(0) : "★"}
                  </span>
                  <span className="mt-3 font-semibold">{b.name}</span>
                  <span className="text-xs text-muted">{b.specialty}</span>
                  <Tbc show={b.aConfirmer} />
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* 3. Date & créneau */}
        {step === 2 && (
          <fieldset className="min-w-0">
            <legend className="font-display text-2xl">Quand ?</legend>
            <div className="mt-5 grid gap-8 md:grid-cols-[1fr_1fr]">
              <Calendar
                today={today}
                maxDays={bookingConfig.maxDaysAhead}
                closedDays={closedDays}
                value={date}
                onChange={(d) => {
                  setDate(d);
                  setTime("");
                }}
              />
              <div>
                {!date ? (
                  <p className="text-sm text-muted">Choisis une date pour voir les créneaux.</p>
                ) : (
                  <>
                    <p className="mb-3 text-sm font-semibold first-letter:uppercase">{formatDateFr(date)}</p>
                    {slots === null ? (
                      <Loader label="Recherche des créneaux…" />
                    ) : slots.length === 0 ? (
                      <p className="text-sm text-muted">Plus de créneau ce jour-là. Essaie une autre date.</p>
                    ) : !slots.some((s) => s.available) ? (
                      <p className="text-sm text-muted">Complet ce jour-là. Essaie une autre date.</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {slots.map((s) => (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            aria-pressed={time === s.time}
                            aria-label={`${fmtTime(s.time)}${s.available ? "" : " (indisponible)"}`}
                            onClick={() => setTime(s.time)}
                            className={`rounded-[6px] border py-2.5 text-sm font-semibold transition-colors ${
                              !s.available
                                ? "cursor-not-allowed border-transparent bg-ink-soft text-muted/40 line-through"
                                : time === s.time
                                  ? "border-gold bg-gold text-ink"
                                  : "border-ink-line hover:border-gold"
                            }`}
                          >
                            {fmtTime(s.time)}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </fieldset>
        )}

        {/* 4. Coordonnées */}
        {step === 3 && total && (
          <form onSubmit={submit} className="space-y-5">
            <h2 className="font-display text-2xl">Tes coordonnées</h2>
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
              <p className="font-semibold">{total.label} · <span className="text-gold">{total.price} €</span></p>
              <p className="mt-1 text-muted first-letter:uppercase">
                {formatDateFr(date)} à {fmtTime(time)} · {barberId ? getBarber(barberId)?.name : t.anyBarber}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="firstName" label="Prénom" required autoComplete="given-name" />
              <Field id="lastName" label="Nom" required autoComplete="family-name" />
              <Field id="phone" label="Téléphone" type="tel" required autoComplete="tel" placeholder="06 12 34 56 78" />
              <Field id="email" label="E-mail" type="email" required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm">Message <span className="text-muted">(facultatif)</span></label>
              <textarea id="message" name="message" rows={3} maxLength={500} className={field} placeholder="Coupe souhaitée, photo de référence à montrer…" />
            </div>
            <div className="hidden" aria-hidden>
              <label htmlFor="website">Site web</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-[#c9a35b]" />
              <span className="text-cream/85">
                J'accepte que {site.name} utilise ces informations pour gérer mon rendez-vous (confirmation, rappel). Voir la{" "}
                <Link href="/confidentialite" target="_blank" className="text-gold underline underline-offset-2">politique de confidentialité</Link>.
              </span>
            </label>
            <p className="text-xs text-muted">{bookingConfig.rules}</p>
            <button type="submit" disabled={sending} className="btn-gold w-full py-4">
              {sending ? "Réservation…" : "Confirmer le rendez-vous"}
            </button>
          </form>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="text-sm font-semibold text-muted hover:text-cream">← Retour</button>
        ) : <span />}
        {step < 3 && (
          <button type="button" disabled={!canGo[step]} onClick={() => setStep(step + 1)} className="btn-gold">
            Continuer
          </button>
        )}
      </div>
    </div>
  );
}

function Progress({ step, onGo }: { step: number; onGo: (i: number) => void }) {
  return (
    <nav aria-label="Étapes de la réservation">
      <div className="h-1 overflow-hidden rounded-full bg-ink-line" aria-hidden>
        <div className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500" style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>
      <ol className="mt-3 grid grid-cols-4 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
        {t.steps.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => onGo(i)}
              disabled={i >= step}
              aria-current={i === step ? "step" : undefined}
              className={`${i === step ? "text-gold" : i < step ? "text-cream hover:text-gold-light" : "text-muted/60"} disabled:cursor-default`}
            >
              <span className="hidden sm:inline">{i + 1}. </span>{label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm">{label}{rest.required && " *"}</label>
      <input id={id} name={id} className={field} {...rest} />
    </div>
  );
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={`text-right first-letter:uppercase ${gold ? "font-display text-lg text-gold" : ""}`}>{value}</dd>
    </div>
  );
}
