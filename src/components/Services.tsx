import Link from "next/link";
import { content } from "@/data/content";
import { services } from "@/data/services";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";
import { Tbc } from "./Tbc";

export function Services() {
  const c = content.services;
  return (
    <section id="tarifs" className="bg-ink-soft py-24" aria-labelledby="tarifs-titre">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <SectionTitle id="tarifs-titre" title={c.title} subtitle={c.subtitle} />
        <Reveal>
          <ul className="mt-14 divide-y divide-ink-line rounded-lg border border-ink-line bg-ink">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/reservation?prestation=${s.id}`}
                  className="group flex items-center justify-between gap-6 px-5 py-5 transition-colors hover:bg-ink-soft md:px-8"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold group-hover:text-gold-light">
                      {s.name}
                      {s.supplement && <span className="ml-2 text-xs font-normal text-muted">(en supplément)</span>}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{s.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-2xl font-semibold text-gold md:text-3xl">
                      {s.supplement && "+"}{s.price} €
                    </p>
                    <p className="text-xs text-muted">{s.duration} min</p>
                    <Tbc show={s.aConfirmer} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-10 text-center">
          <Link href="/reservation" className="btn-gold">{c.cta}</Link>
        </div>
      </div>
    </section>
  );
}
