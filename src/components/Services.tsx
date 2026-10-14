import Link from "next/link";
import { content } from "@/data/content";
import { services } from "@/data/services";
import { SectionTitle } from "./SectionTitle";
import { Tbc } from "./Tbc";

export function Services() {
  const c = content.services;
  return (
    <section id="tarifs" className="stripes border-y border-ink-line bg-ink-soft py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line md:grid-cols-2">
          {services.map((s) => (
            <li key={s.id} className="flex items-start justify-between gap-6 bg-ink p-6 md:p-8 md:last:odd:col-span-2">
              <div>
                <h3 className="font-display text-2xl font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted">{s.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{s.duration} min</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-3xl font-semibold text-gold">{s.price} €</p>
                <Tbc show={s.aConfirmer} />
                <Link
                  href={`/reservation?service=${s.id}`}
                  className="mt-3 block text-xs font-bold uppercase tracking-[0.15em] text-cream/70 hover:text-gold"
                >
                  Réserver →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
