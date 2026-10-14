import Image from "next/image";
import { site } from "@/data/site";

/**
 * Logo recréé en texte (brief §2) : « Flex » Playfair italique blanc, « HAIR » blanc,
 * « STYLE » or, courbe dorée au-dessus. Remplacé automatiquement par
 * site.logoSrc (ex. /logo.svg) dès qu'il est renseigné.
 */
export function Logo({ size = "md", className = "" }: { size?: "md" | "lg"; className?: string }) {
  const big = size === "lg";
  if (site.logoSrc) {
    return <Image src={site.logoSrc} alt={site.name} width={big ? 320 : 120} height={big ? 160 : 60} className={className} priority />;
  }
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`} role="img" aria-label={site.name}>
      <span className="relative">
        <svg aria-hidden viewBox="0 0 120 24" className={`absolute text-gold ${big ? "-top-7 left-12 w-44 md:w-56" : "-top-2.5 left-5 w-[70px]"}`}>
          <path d="M2 21 C 38 4, 82 0, 118 7" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M16 22 C 50 9, 86 6, 116 12" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </svg>
        <span className={`font-display font-semibold italic text-cream ${big ? "text-7xl md:text-9xl" : "text-[28px]"}`}>Flex</span>
      </span>
      <span className={`title-caps ${big ? "mt-1 text-2xl tracking-[0.2em] md:text-4xl" : "text-[11px] tracking-[0.14em]"}`}>
        <span className="text-cream">Hair</span>
        <span className="text-gold">Style</span>
      </span>
    </span>
  );
}
