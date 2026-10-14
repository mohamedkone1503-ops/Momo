import { reviews } from "@/data/reviews";
import { SectionTitle } from "./SectionTitle";

/** Ne s'affiche que si de vrais avis sont renseignés dans src/data/reviews.ts */
export function Reviews() {
  if (reviews.length === 0) return null;
  return (
    <section id="avis" className="border-t border-ink-line bg-ink-soft py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="Avis" title="Ils en parlent" center />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.author + r.text} className="rounded-2xl border border-ink-line bg-ink p-6">
              <p className="text-gold" aria-label={`${r.rating} sur 5`}>{"★".repeat(r.rating)}</p>
              <blockquote className="mt-4 text-cream/85">« {r.text} »</blockquote>
              <p className="mt-4 text-sm font-semibold">{r.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
