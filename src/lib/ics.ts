import { site, fullAddress } from "@/data/site";

/** Fichier agenda (.ics) pour « Ajouter à mon agenda ». Heures en Europe/Paris. */
export function buildIcs(o: { id: string; date: string; time: string; duration: number; title: string }) {
  const start = new Date(`${o.date}T${o.time}:00Z`);
  const end = new Date(start.getTime() + o.duration * 60000);
  const local = (d: Date) => d.toISOString().replace(/[-:]/g, "").slice(0, 15); // AAAAMMJJTHHMMSS
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const esc = (s: string) => s.replace(/[\;,]/g, (m) => `\\${m}`);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Flex Hairstyle//Reservation//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${o.id}@flex-hairstyle`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Paris:${local(start)}`,
    `DTEND;TZID=Europe/Paris:${local(end)}`,
    `SUMMARY:${esc(`${o.title} – ${site.name}`)}`,
    `LOCATION:${esc(`${site.name}, ${fullAddress}`)}`,
    `DESCRIPTION:${esc(`Rendez-vous chez ${site.name}. Tél. ${site.phone}`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Rappel rendez-vous",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
