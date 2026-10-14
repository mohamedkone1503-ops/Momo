import Image from "next/image";
import Link from "next/link";
import { content } from "@/data/content";
import { heroPhoto } from "@/data/gallery";
import { site } from "@/data/site";

export function Hero() {
  const c = content.hero;
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0">
      <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">{c.eyebrow}</p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
          <span className="sr-only">{site.name} — </span>
          {c.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-cream/85">{c.subtitle}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/reservation"
            className="rounded-full bg-gold px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.15em] text-ink hover:bg-gold-light"
          >
            {c.ctaPrimary}
          </Link>
          <Link
            href="/#tarifs"
            className="rounded-full border border-cream/40 px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.15em] hover:border-gold hover:text-gold"
          >
            {c.ctaSecondary}
          </Link>
        </div>
        <p className="mt-10 text-sm text-muted">{site.address.street} · {site.address.city} {site.address.postalCode.slice(-2)}e</p>
      </div>
    </section>
  );
}
