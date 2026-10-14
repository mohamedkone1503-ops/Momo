"use client";

import { useState } from "react";
import { addDays, dayIndex } from "@/lib/time";

const WEEK = ["L", "M", "M", "J", "V", "S", "D"];
const WEEK_FULL = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** Calendrier mensuel. Dates au format YYYY-MM-DD (heure de Paris). */
export function Calendar({
  today,
  maxDays,
  closedDays,
  value,
  onChange,
}: {
  today: string;
  maxDays: number;
  closedDays: number[]; // 0 = lundi
  value: string;
  onChange: (date: string) => void;
}) {
  const last = addDays(today, maxDays);
  const [month, setMonth] = useState((value || today).slice(0, 7)); // YYYY-MM

  const first = `${month}-01`;
  const offset = dayIndex(first);
  const daysInMonth = new Date(Date.UTC(+month.slice(0, 4), +month.slice(5, 7), 0)).getUTCDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => addDays(first, i))];

  const shift = (n: number) => {
    const d = new Date(`${first}T12:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() + n);
    setMonth(d.toISOString().slice(0, 7));
  };
  const canPrev = month > today.slice(0, 7);
  const canNext = month < last.slice(0, 7);
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${first}T12:00:00Z`));

  return (
    <div className="rounded-lg border border-ink-line bg-ink p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} className="flex h-10 w-10 items-center justify-center rounded-full text-xl hover:text-gold disabled:opacity-20" aria-label="Mois précédent">‹</button>
        <p className="font-semibold capitalize" aria-live="polite">{monthLabel}</p>
        <button type="button" onClick={() => shift(1)} disabled={!canNext} className="flex h-10 w-10 items-center justify-center rounded-full text-xl hover:text-gold disabled:opacity-20" aria-label="Mois suivant">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label={monthLabel}>
        {WEEK.map((d, i) => (
          <span key={i} className="pb-2 text-[11px] font-bold text-muted" role="columnheader" aria-label={WEEK_FULL[i]}>{d}</span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const disabled = d < today || d > last || closedDays.includes(dayIndex(d));
          const selected = d === value;
          return (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => onChange(d)}
              aria-pressed={selected}
              aria-label={new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`))}
              className={`aspect-square rounded-[6px] text-sm font-semibold transition-colors ${
                selected
                  ? "bg-gold text-ink"
                  : disabled
                    ? "cursor-not-allowed text-muted/25"
                    : `hover:bg-ink-soft hover:text-gold ${d === today ? "ring-1 ring-gold/50" : ""}`
              }`}
            >
              {+d.slice(8)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
