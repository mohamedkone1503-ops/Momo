"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { content } from "@/data/content";
import { CalendarIcon } from "./Icons";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const onBooking = pathname.startsWith("/reservation");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open || pathname !== "/" ? "border-b border-ink-line bg-ink/95 backdrop-blur" : "bg-gradient-to-b from-ink/80 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="pt-2" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
            {content.nav.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/85 transition-colors hover:text-gold">
                {l.label}
              </Link>
            ))}
            <Link href="/reservation" className="btn-gold px-5 py-2.5 text-xs">{content.cta}</Link>
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3.5 w-6">
              <span className={`absolute left-0 h-0.5 w-6 bg-cream transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-cream transition ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-6 bg-cream transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>

        {open && (
          <nav id="menu-mobile" className="max-h-[calc(100svh-72px)] overflow-y-auto border-t border-ink-line px-4 pb-6 lg:hidden" aria-label="Navigation mobile">
            {content.nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-ink-line py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Bouton « Prendre RDV » flottant (mobile) */}
      {!onBooking && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <Link href="/reservation" className="btn-gold w-full py-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <CalendarIcon className="h-4 w-4" />
            {content.cta}
          </Link>
        </div>
      )}
    </>
  );
}
