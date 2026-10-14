/** Reproduction typographique du logo de l'enseigne : « Flex » serif + « HAIR » blanc + « STYLE » or. */
export function Logo({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label="Flex Hairstyle">
      <span className="relative">
        <svg
          aria-hidden
          viewBox="0 0 120 20"
          className={`absolute ${big ? "-top-5 left-10 w-40" : "-top-2.5 left-5 w-16"} text-gold`}
        >
          <path d="M2 18 C 40 2, 80 0, 118 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M14 18 C 48 7, 84 5, 116 10" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
        <span className={`font-display font-semibold text-cream ${big ? "text-6xl md:text-7xl" : "text-2xl"}`}>Flex</span>
      </span>
      <span className={`font-sans font-extrabold uppercase tracking-[0.08em] ${big ? "text-2xl md:text-3xl" : "text-[11px]"}`}>
        <span className="text-cream">Hair</span>
        <span className="text-gold">Style</span>
      </span>
    </span>
  );
}
