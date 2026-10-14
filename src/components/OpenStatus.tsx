"use client";

import { useEffect, useState } from "react";
import { openStatus } from "@/lib/time";

/** « Ouvert maintenant / Fermé », calculé à l'heure de Paris, côté navigateur. */
export function OpenStatus({ className = "" }: { className?: string }) {
  const [s, setS] = useState<ReturnType<typeof openStatus> | null>(null);
  useEffect(() => {
    const update = () => setS(openStatus());
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);
  if (!s) return <span className={`inline-block h-7 ${className}`} />;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        s.open ? "border-emerald-400/40 text-emerald-300" : "border-ink-line text-muted"
      } ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.open ? "bg-emerald-400" : "bg-muted"}`} aria-hidden />
      {s.label}
    </span>
  );
}
