import { NextResponse } from "next/server";
import { getSlots } from "@/lib/reservations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const extras = (q.get("extras") ?? "").split(",").filter(Boolean);
  const slots = await getSlots(q.get("date") ?? "", q.get("service") ?? "", q.get("barber") || null, extras);
  return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
}
