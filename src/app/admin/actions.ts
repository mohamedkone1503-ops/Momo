"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, checkPassword, cookieOptions, isAdmin, makeToken } from "@/lib/auth";
import { deleteReservation, updateReservationStatus, type ReservationStatus } from "@/lib/reservations";

export async function login(_: unknown, form: FormData) {
  // Petite temporisation pour freiner les essais en rafale
  await new Promise((r) => setTimeout(r, 600));
  if (!checkPassword(String(form.get("password") ?? ""))) return { error: "Mot de passe incorrect." };
  (await cookies()).set(ADMIN_COOKIE, makeToken(), cookieOptions);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function setStatus(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const status = String(form.get("status")) as ReservationStatus;
  if (!["en_attente", "confirmee", "annulee"].includes(status)) return;
  await updateReservationStatus(String(form.get("id")), status);
  revalidatePath("/admin");
}

export async function remove(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  await deleteReservation(String(form.get("id")));
  revalidatePath("/admin");
}
