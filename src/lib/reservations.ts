import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { barbers } from "@/data/barbers";
import { bookingConfig } from "@/data/booking";
import { extraServices, getService, totals } from "@/data/services";
import { addDays, fromMinutes, hoursFor, isValidDate, parisNow, toMinutes } from "./time";

/**
 * Stockage dans data/*.json : convient en local ou sur un serveur
 * classique (VPS). Sur Vercel, remplacer read/write par une base de
 * données (Vercel KV/Postgres, Supabase…) : seules ces deux fonctions
 * touchent au disque.
 */
const DIR = path.join(process.cwd(), "data");

export type Reservation = {
  id: string;
  serviceId: string;
  extraIds: string[]; // suppléments (ex. design)
  requestedBarberId: string | null; // null = « Peu importe »
  barberId: string; // barbier attribué
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message?: string;
  consentAt: string;
  status: "confirmee" | "annulee";
  createdAt: string;
};

/** Créneau bloqué (congés, pause…). barberId null = tout le salon. */
export type Block = { id: string; date: string; start: string; end: string; barberId: string | null; reason: string };

async function read<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, file), "utf8"));
  } catch {
    return [];
  }
}
async function write(file: string, data: unknown) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, file), JSON.stringify(data, null, 2));
}

let queue: Promise<unknown> = Promise.resolve();
/** Sérialise les écritures pour éviter les doubles réservations. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

export const listReservations = () => read<Reservation>("reservations.json");
export const listBlocks = () => read<Block>("blocks.json");

type Interval = [number, number];
const overlaps = (a: Interval, b: Interval) => a[0] < b[1] && b[0] < a[1];

/** Plages occupées par barbier pour une date. */
async function busyByBarber(date: string) {
  const [reservations, blocks] = await Promise.all([listReservations(), listBlocks()]);
  const busy = new Map<string, Interval[]>(barbers.map((b) => [b.id, []]));
  for (const r of reservations) {
    if (r.date !== date || r.status === "annulee") continue;
    const s = toMinutes(r.time);
    busy.get(r.barberId)?.push([s, s + (totals(r.serviceId, r.extraIds).duration || 30)]);
  }
  for (const b of blocks) {
    if (b.date !== date) continue;
    const iv: Interval = [toMinutes(b.start), toMinutes(b.end)];
    for (const [id, list] of busy) if (b.barberId === null || b.barberId === id) list.push(iv);
  }
  return busy;
}

export type Slot = { time: string; available: boolean };

/** Tous les créneaux d'une journée, avec leur disponibilité (créneaux pris = grisés). */
export async function getSlots(date: string, serviceId: string, barberId: string | null, extraIds: string[] = []): Promise<Slot[]> {
  const service = getService(serviceId);
  if (!service || service.supplement || !isValidDate(date)) return [];
  if (extraIds.some((id) => !extraServices.some((e) => e.id === id))) return [];
  const duration = totals(serviceId, extraIds).duration;
  if (barberId && !barbers.some((b) => b.id === barberId)) return [];

  const now = parisNow();
  if (date < now.date || date > addDays(now.date, bookingConfig.maxDaysAhead)) return [];

  const busy = await busyByBarber(date);
  const candidates = barberId ? [barberId] : barbers.map((b) => b.id);
  const slots: Slot[] = [];

  for (const [open, close] of hoursFor(date).slots) {
    for (let s = toMinutes(open); s + duration <= toMinutes(close); s += bookingConfig.slotStepMinutes) {
      if (date === now.date && s < now.minutes + bookingConfig.minNoticeMinutes) continue;
      const iv: Interval = [s, s + duration];
      const free = candidates.some((id) => !busy.get(id)!.some((b) => overlaps(b, iv)));
      slots.push({ time: fromMinutes(s), available: free });
    }
  }
  return slots;
}

export type NewReservation = Omit<Reservation, "id" | "barberId" | "status" | "createdAt" | "consentAt">;

export async function createReservation(input: NewReservation) {
  return withLock(async () => {
    const slots = await getSlots(input.date, input.serviceId, input.requestedBarberId, input.extraIds);
    if (!slots.some((s) => s.time === input.time && s.available)) {
      return { ok: false as const, error: "Ce créneau vient d'être pris. Merci d'en choisir un autre." };
    }

    // Attribution du barbier : celui demandé, sinon le moins chargé de la journée parmi les libres
    const busy = await busyByBarber(input.date);
    const s = toMinutes(input.time);
    const iv: Interval = [s, s + totals(input.serviceId, input.extraIds).duration];
    const free = (input.requestedBarberId ? [input.requestedBarberId] : barbers.map((b) => b.id))
      .filter((id) => !busy.get(id)!.some((b) => overlaps(b, iv)))
      .sort((a, b) => busy.get(a)!.length - busy.get(b)!.length);

    const now = new Date().toISOString();
    const reservation: Reservation = {
      ...input,
      id: randomUUID(),
      barberId: free[0],
      status: "confirmee",
      consentAt: now,
      createdAt: now,
    };
    const list = await listReservations();
    list.push(reservation);
    await write("reservations.json", list);
    return { ok: true as const, reservation };
  });
}

export async function cancelReservation(id: string) {
  return withLock(async () => {
    const list = await listReservations();
    const r = list.find((x) => x.id === id);
    if (!r || r.status === "annulee") return null;
    r.status = "annulee";
    await write("reservations.json", list);
    return r;
  });
}

export async function deleteReservation(id: string) {
  return withLock(async () => {
    const list = await listReservations();
    await write("reservations.json", list.filter((x) => x.id !== id));
  });
}

export async function addBlock(block: Omit<Block, "id">) {
  return withLock(async () => {
    const list = await listBlocks();
    list.push({ ...block, id: randomUUID() });
    list.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    await write("blocks.json", list);
  });
}

export async function removeBlock(id: string) {
  return withLock(async () => {
    const list = await listBlocks();
    await write("blocks.json", list.filter((b) => b.id !== id));
  });
}
