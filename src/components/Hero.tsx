import Image from "next/image";
import Link from "next/link";
import { content } from "@/data/content";
import { heroPhoto } from "@/data/gallery";
import { PinIcon } from "./Icons";
import { Logo } from "./Logo";

export function Hero() {
  const c = content.hero;
  return (
    <section id="accueil" className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28">
      <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="100vw" className="object-cover" />
      {/* Voile noir */}
      <div className="absolute inset-0 bg-ink/70" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-4 text-center md:px-6">
        <h1 className="flex justify-center">
          <Logo size="lg" />
        </h1>
        <p className="title-caps mt-8 text-sm text-gold md:text-base">{c.subtitle}</p>
        <p className="mx-auto mt-5 max-w-xl text-lg text-cream/90 md:text-xl">{c.pitch}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/reservation" className="btn-gold">{c.ctaPrimary}</Link>
          <Link href="/#tarifs" className="btn-outline">{c.ctaSecondary}</Link>
        </div>
        <p className="mt-10 inline-flex items-center gap-2 text-sm text-cream/80">
          <PinIcon className="h-4 w-4 shrink-0 text-gold" />
          {c.info}
        </p>
      </div>
    </section>
  );
}
