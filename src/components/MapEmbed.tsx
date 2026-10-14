"use client";

import { fullAddress, site } from "@/data/site";
import { setConsent, useConsent } from "@/lib/consent";
import { PinIcon } from "./Icons";

export function MapEmbed() {
  const consent = useConsent();
  const q = encodeURIComponent(`${site.name}, ${fullAddress}`);

  if (consent === "accepted") {
    return (
      <iframe
        title={`Carte : ${site.name}, ${fullAddress}`}
        src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
        className="h-full min-h-[340px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <div className="stripes flex h-full min-h-[340px] flex-col items-center justify-center gap-4 p-8 text-center">
      <PinIcon className="h-10 w-10 text-gold" />
      <p className="font-display text-xl">{fullAddress}</p>
      <p className="max-w-xs text-sm text-muted">La carte Google Maps dépose des cookies. Elle s'affiche avec ton accord.</p>
      <button type="button" onClick={() => setConsent("accepted")} className="btn-outline px-5 py-2.5 text-xs">Afficher la carte</button>
    </div>
  );
}
