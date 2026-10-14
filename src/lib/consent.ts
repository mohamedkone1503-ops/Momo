"use client";

import { useSyncExternalStore } from "react";

/** Consentement cookies (Google Maps). Stocké dans le navigateur du visiteur. */
export type Consent = "accepted" | "refused" | null;
const KEY = "flex-cookie-consent";
const EVENT = "flex-consent-change";

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "refused" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function resetConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

/** "pending" côté serveur pour ne rien afficher avant hydratation. */
export const useConsent = () => useSyncExternalStore<Consent | "pending">(subscribe, read, () => "pending");
