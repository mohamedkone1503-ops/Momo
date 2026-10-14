import { bookingConfig } from "@/data/booking";
import { site } from "@/data/site";

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
export const fmtTime = (hhmm: string) => hhmm.replace(":", "h");

/** Date, heure et jour actuels à Paris. */
export function parisNow(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: bookingConfig.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Index dans site.hours (0 = lundi) */
export const dayIndex = (date: string) => (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
export const hoursFor = (date: string) => site.hours[dayIndex(date)];

export function formatDateFr(date: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) {
  return new Intl.DateTimeFormat("fr-FR", { ...opts, timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
export const isValidTime = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

/** Statut d'ouverture actuel (pour « Ouvert maintenant / Fermé »). */
export function openStatus(at = new Date()) {
  const now = parisNow(at);
  const today = hoursFor(now.date);
  const current = today.slots.find(([o, c]) => now.minutes >= toMinutes(o) && now.minutes < toMinutes(c));
  if (current) return { open: true, label: `Ouvert maintenant · jusqu'à ${fmtTime(current[1])}` };
  const later = today.slots.find(([o]) => toMinutes(o) > now.minutes);
  if (later) return { open: false, label: `Fermé · ouvre à ${fmtTime(later[0])}` };
  for (let i = 1; i <= 7; i++) {
    const d = addDays(now.date, i);
    const h = hoursFor(d);
    if (h.slots.length) return { open: false, label: `Fermé · ouvre ${i === 1 ? "demain" : h.day.toLowerCase()} à ${fmtTime(h.slots[0][0])}` };
  }
  return { open: false, label: "Fermé" };
}
