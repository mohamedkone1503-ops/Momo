"use client";

import { resetConsent } from "@/lib/consent";

export function ResetConsent() {
  return (
    <button type="button" onClick={resetConsent} className="btn-outline mt-4 px-5 py-2.5 text-xs">
      Modifier mon choix cookies
    </button>
  );
}
