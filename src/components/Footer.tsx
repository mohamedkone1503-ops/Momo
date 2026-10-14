import Link from "next/link";
import { fullAddress, placeholders, site } from "@/data/site";
import { Logo } from "./Logo";
import { Tbc } from "./Tbc";

export function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink-soft">
      <div className="barber-pole h-1.5" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">{site.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">Contact</p>
          <p>{fullAddress}</p>
          <p className="mt-1">
            <a href={`tel:${site.phoneHref}`} className="hover:text-gold">{site.phone}</a>
            <Tbc show={placeholders.phone} />
          </p>
          <p className="mt-1">
            <a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a>
            <Tbc show={placeholders.email} />
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">Suivez-nous</p>
          <div className="flex gap-4">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a>
            <a href={site.social.snapchat} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Snapchat</a>
            <Tbc show={placeholders.social} />
          </div>
          <Link href="/mentions-legales" className="mt-6 block text-xs text-muted hover:text-cream">Mentions légales</Link>
        </div>
      </div>
      <p className="border-t border-ink-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. Tous droits réservés.
      </p>
    </footer>
  );
}
