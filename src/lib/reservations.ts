import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { bookingRules } from "@/data/booking";
import { getService } from "@/data/services";
import { addDays, fromMinutes, hoursFor, isValidDate, parisNow, toMinutes } from "./time";

/**
 * Stockage simple dans data/reservations.json.
 * Suffisant en local ou sur un serveur classique ; pour un hébergement
 * serverless (Vercel…), remplacer par une base de données.
 */
const FILE = path.join(process.cwd(), "data", "reservations.json");

export type ReservationStatus = "en_attente" | "confirmee" | "annulee";

export type Reservation = {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  phone: string;
  email?: string;
  note?: string;
  status: ReservationStatus;
  createdAt: string;
};

let queue: Promise<unknown> = Promise.resolve();
/** Sérialise les écritures pour éviter deux réservations sur le même créneau. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

export async function listReservations(): Promise<Reservation[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function save(list: Reservation[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}

/** Créneaux libres pour une date et une prestation. */
export async function availableSlots(date: string, serviceId: string): Promise<string[]> {
  const service = getService(serviceId);
  if (!service || !isValidDate(date)) return [];

  const now = parisNow();
  if (date < now.date || date > addDays(now.date, bookingRules.maxDaysAhead)) return [];

  const h = hoursFor(date);
  if (!h.open || !h.close) return [];

  const taken = (await listReservations()).filter((r) => r.date === date && r.status !== "annulee");
  const slots: string[] = [];
  const open = toMinutes(h.open);
  const close = toMinutes(h.close);

  for (let start = open; start + service.duration <= close; start += bookingRules.slotStepMinutes) {
    if (date === now.date && start < now.minutes + bookingRules.minNoticeMinutes) continue;
    const end = start + service.duration;
    const overlapping = taken.filter((r) => {
      const rs = toMinutes(r.time);
      const re = rs + (getService(r.serviceId)?.duration ?? bookingRules.slotStepMinutes);
      return rs < end && start < re;
    }).length;
    if (overlapping < bookingRules.seats) slots.push(fromMinutes(start));
  }
  return slots;
}

export type NewReservation = Pick<Reservation, "serviceId" | "date" | "time" | "name" | "phone" | "email" | "note">;

export async function createReservation(input: NewReservation) {
  return withLock(async () => {
    const slots = await availableSlots(input.date, input.serviceId);
    if (!slots.includes(input.time)) {
      return { ok: false as const, error: "Ce créneau n'est plus disponible. Merci d'en choisir un autre." };
    }
    const list = await listReservations();
    const reservation: Reservation = {
      ...input,
      id: randomUUID(),
      status: "en_attente",
      createdAt: new Date().toISOString(),
    };
    list.push(reservation);
    await save(list);
    return { ok: true as const, reservation };
  });
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  return withLock(async () => {
    const list = await listReservations();
    const r = list.find((x) => x.id === id);
    if (!r) return false;
    r.status = status;
    await save(list);
    return true;
  });
}

export async function deleteReservation(id: string) {
  return withLock(async () => {
    const list = await listReservations();
    const next = list.filter((x) => x.id !== id);
    await save(next);
    return next.length !== list.length;
  });
}
