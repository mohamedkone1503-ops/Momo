import { NextResponse } from "next/server";
import { sendBookingEmails } from "@/lib/mail";
import { createReservation } from "@/lib/reservations";
import { isValidDate, isValidTime } from "@/lib/time";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return bad("Requête invalide.");
  }

  // Champ piège anti-robots
  if (str(b.website, 200)) return NextResponse.json({ ok: true });

  const input = {
    serviceId: str(b.serviceId, 50),
    extraIds: Array.isArray(b.extraIds) ? b.extraIds.filter((x): x is string => typeof x === "string").slice(0, 5) : [],
    requestedBarberId: str(b.barberId, 50) || null,
    date: str(b.date, 10),
    time: str(b.time, 5),
    firstName: str(b.firstName, 50),
    lastName: str(b.lastName, 50),
    phone: str(b.phone, 30),
    email: str(b.email, 120),
    message: str(b.message, 500) || undefined,
  };

  if (!isValidDate(input.date) || !isValidTime(input.time)) return bad("Créneau invalide.");
  if (input.firstName.length < 1 || input.lastName.length < 1) return bad("Merci d'indiquer ton prénom et ton nom.");
  if (input.phone.replace(/\D/g, "").length < 9) return bad("Numéro de téléphone invalide.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return bad("Adresse e-mail invalide.");
  if (b.consent !== true) return bad("Merci d'accepter l'utilisation de tes données pour gérer le rendez-vous.");

  const result = await createReservation(input);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });

  const emailSent = await sendBookingEmails(result.reservation);
  return NextResponse.json({ ok: true, id: result.reservation.id, barberId: result.reservation.barberId, emailSent });
}
