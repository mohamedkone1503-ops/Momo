/** Courbe dorée (swoosh du logo) utilisée comme séparateur de sections. */
export function Swoosh({ className = "", align = "center" }: { className?: string; align?: "center" | "start" }) {
  return (
    <div className={`flex ${align === "start" ? "justify-start" : "justify-center"} ${className}`} aria-hidden>
      <svg viewBox="0 0 240 24" className="w-44 text-gold md:w-60">
        <path d="M4 20 C 70 2, 170 2, 236 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M40 22 C 100 10, 170 9, 230 18" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
}

/** Motif barber pole (séparateur fin, ou loader animé). */
export function BarberPole({ className = "h-1.5", animated = false }: { className?: string; animated?: boolean }) {
  return <div className={`barber-pole ${animated ? "barber-pole-anim" : ""} ${className}`} aria-hidden />;
}

export function Loader({ label = "Chargement…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted" role="status">
      <BarberPole animated className="h-6 w-2.5 rounded-full" />
      {label}
    </div>
  );
}
