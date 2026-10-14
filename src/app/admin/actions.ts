"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { barbers } from "@/data/barbers";
import { ADMIN_COOKIE, checkPassword, cookieOptions, isAdmin, makeToken } from "@/lib/auth";
import { sendCancellationEmail } from "@/lib/mail";
import { addBlock, cancelReservation, deleteReservation, removeBlock } from "@/lib/reservations";
import { isValidDate, isValidTime, toMinutes } from "@/lib/time";

export async function login(_: unknown, form: FormData) {
  await new Promise((r) => setTimeout(r, 600)); // freine les essais en rafale
  if (!checkPassword(String(form.get("password") ?? ""))) return { error: "Mot de passe incorrect." };
  (await cookies()).set(ADMIN_COOKIE, makeToken(), cookieOptions);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

async function guard() {
  if (!(await isAdmin())) redirect("/admin");
}

export async function cancel(form: FormData) {
  await guard();
  const r = await cancelReservation(String(form.get("id")));
  if (r && form.get("notify") === "on") await sendCancellationEmail(r);
  revalidatePath("/admin");
}

export async function remove(form: FormData) {
  await guard();
  await deleteReservation(String(form.get("id")));
  revalidatePath("/admin");
}

export async function block(_: unknown, form: FormData) {
  await guard();
  const date = String(form.get("date"));
  const allDay = form.get("allDay") === "on";
  const start = allDay ? "00:00" : String(form.get("start"));
  const end = allDay ? "23:59" : String(form.get("end"));
  const barber = String(form.get("barberId") || "");
  if (!isValidDate(date)) return { error: "Date invalide." };
  if (!isValidTime(start) || !isValidTime(end) || toMinutes(end) <= toMinutes(start)) return { error: "Horaires invalides." };
  if (barber && !barbers.some((b) => b.id === barber)) return { error: "Barbier inconnu." };
  await addBlock({ date, start, end, barberId: barber || null, reason: String(form.get("reason") || "Indisponible").slice(0, 80) });
  revalidatePath("/admin");
  return { ok: true };
}

export async function unblock(form: FormData) {
  await guard();
  await removeBlock(String(form.get("id")));
  revalidatePath("/admin");
}
