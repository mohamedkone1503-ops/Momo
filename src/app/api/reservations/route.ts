import { NextResponse } from "next/server";
import { getService } from "@/data/services";
import { createReservation } from "@/lib/reservations";
import { isValidDate } from "@/lib/time";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège anti-spam : rempli uniquement par les robots
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const input = {
    serviceId: clean(body.serviceId, 50),
    date: clean(body.date, 10),
    time: clean(body.time, 5),
    name: clean(body.name, 80),
    phone: clean(body.phone, 30),
    email: clean(body.email, 120) || undefined,
    note: clean(body.note, 500) || undefined,
  };

  if (!getService(input.serviceId)) return bad("Prestation inconnue.");
  if (!isValidDate(input.date) || !/^\d{2}:\d{2}$/.test(input.time)) return bad("Créneau invalide.");
  if (input.name.length < 2) return bad("Merci d'indiquer votre nom.");
  if (input.phone.replace(/[^\d]/g, "").length < 9) return bad("Numéro de téléphone invalide.");
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return bad("Adresse e-mail invalide.");

  const result = await createReservation(input);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });
  return NextResponse.json({ ok: true });
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
