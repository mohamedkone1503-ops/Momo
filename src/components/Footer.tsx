import Link from "next/link";
import { fullAddress, placeholders, site } from "@/data/site";
import { BarberPole } from "./Decor";
import { Logo } from "./Logo";
import { Social } from "./Social";
import { Tbc } from "./Tbc";

export function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink pb-24 lg:pb-0">
      <BarberPole />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted">{site.tagline}</p>
          <Social className="mt-6" />
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Adresse</p>
          <p>{fullAddress}</p>
          <p className="mt-2">
            <a href={`tel:${site.phoneHref}`} className="hover:text-gold">{site.phone}</a>
            <Tbc show={placeholders.phone} />
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Horaires<Tbc show={placeholders.hours} /></p>
          <p>{site.hoursSummary}</p>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            <Link href="/mentions-legales" className="hover:text-cream">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-cream">Politique de confidentialité</Link>
          </p>
        </div>
      </div>
      <p className="border-t border-ink-line py-5 text-center text-xs text-muted">© {site.name} {new Date().getFullYear()}</p>
    </footer>
  );
}
