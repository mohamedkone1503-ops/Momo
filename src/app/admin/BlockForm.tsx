"use client";

import { useActionState, useState } from "react";
import { barbers } from "@/data/barbers";
import { block } from "./actions";

const input = "w-full rounded-[6px] border border-ink-line bg-ink px-3 py-2.5 text-sm focus:border-gold focus:outline-none";

export function BlockForm({ today }: { today: string }) {
  const [state, action, pending] = useActionState(block, null);
  const [allDay, setAllDay] = useState(false);
  return (
    <form action={action} className="grid gap-3 rounded-lg border border-ink-line bg-ink-soft p-5 sm:grid-cols-2 lg:grid-cols-6">
      <label className="text-xs text-muted lg:col-span-1">Date
        <input type="date" name="date" required min={today} defaultValue={today} className={`${input} mt-1`} />
      </label>
      <label className="text-xs text-muted">De
        <input type="time" name="start" defaultValue="12:00" step={900} disabled={allDay} className={`${input} mt-1 disabled:opacity-40`} />
      </label>
      <label className="text-xs text-muted">À
        <input type="time" name="end" defaultValue="13:00" step={900} disabled={allDay} className={`${input} mt-1 disabled:opacity-40`} />
      </label>
      <label className="text-xs text-muted">Qui
        <select name="barberId" className={`${input} mt-1`}>
          <option value="">Tout le salon</option>
          {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </label>
      <label className="text-xs text-muted">Motif
        <input name="reason" placeholder="Pause, congés…" className={`${input} mt-1`} />
      </label>
      <div className="flex flex-col justify-end gap-2">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="allDay" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} className="accent-[#c9a35b]" />
          Journée entière
        </label>
        <button type="submit" disabled={pending} className="btn-gold px-4 py-2.5 text-xs">Bloquer</button>
      </div>
      {state?.error && <p className="text-sm text-red-300 sm:col-span-2 lg:col-span-6" role="alert">{state.error}</p>}
    </form>
  );
}
