"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setConsent, useConsent } from "@/lib/consent";

export function CookieBanner() {
  const consent = useConsent();
  const pathname = usePathname();
  if (consent !== null || pathname.startsWith("/admin")) return null;
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookies"
      className="fixed inset-x-3 bottom-20 z-[70] mx-auto max-w-xl rounded-lg border border-ink-line bg-ink-soft p-5 shadow-2xl md:bottom-6"
    >
      <p className="text-sm text-cream/90">
        Ce site n'utilise pas de cookies publicitaires. La carte Google Maps peut en déposer : elle ne s'affiche
        qu'avec ton accord.{" "}
        <Link href="/confidentialite" className="text-gold underline underline-offset-2 hover:text-gold-light">En savoir plus</Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => setConsent("accepted")} className="btn-gold flex-1 px-4 py-2.5">Accepter</button>
        <button type="button" onClick={() => setConsent("refused")} className="btn-outline flex-1 px-4 py-2.5">Refuser</button>
      </div>
    </div>
  );
}
