import { NextResponse } from "next/server";
import { availableSlots } from "@/lib/reservations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? "";
  const service = searchParams.get("service") ?? "";
  return NextResponse.json({ slots: await availableSlots(date, service) });
}
