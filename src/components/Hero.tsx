import Image from "next/image";
import Link from "next/link";
import { content } from "@/data/content";
import { heroPhoto } from "@/data/gallery";
import { PinIcon } from "./Icons";
import { Logo } from "./Logo";

export function Hero() {
  const c = content.hero;
  return (
    <section id="accueil" className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-24 lg:pt-28">
      <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="100vw" className="object-cover" />
      {/* Voile noir */}
      <div className="absolute inset-0 bg-ink/70" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-4 text-center md:px-6">
        <h1 className="flex justify-center">
          <Logo size="lg" />
        </h1>
        <p className="title-caps mt-[clamp(1rem,3svh,2rem)] text-sm text-gold md:text-base">{c.subtitle}</p>
        <p className="mx-auto mt-[clamp(0.75rem,2svh,1.25rem)] max-w-xl text-base text-cream/90 sm:text-lg md:text-xl">{c.pitch}</p>
        <div className="mt-[clamp(1.25rem,4svh,2.5rem)] flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/reservation" className="btn-gold">{c.ctaPrimary}</Link>
          <Link href="/#tarifs" className="btn-outline">{c.ctaSecondary}</Link>
        </div>
        <p className="mt-[clamp(1rem,4svh,2.5rem)] inline-flex items-center gap-2 text-sm text-cream/80">
          <PinIcon className="h-4 w-4 shrink-0 text-gold" />
          {c.info}
        </p>
      </div>
    </section>
  );
}
