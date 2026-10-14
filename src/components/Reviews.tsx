import { content } from "@/data/content";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { Star } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";
import { Tbc } from "./Tbc";

export function Reviews() {
  if (reviews.length === 0) return null;
  return (
    <section id="avis" className="stripes bg-ink-soft py-24" aria-labelledby="avis-titre">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle id="avis-titre" title={content.reviews.title} />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.author + i}>
              <Reveal delay={i * 120} className="flex h-full flex-col rounded-lg border border-ink-line bg-ink p-7">
                <p className="flex gap-1 text-gold" role="img" aria-label={`Note : ${r.rating} sur 5`}>
                  {Array.from({ length: r.rating }, (_, k) => <Star key={k} />)}
                </p>
                <blockquote className="mt-5 flex-1 font-display text-lg italic leading-relaxed">« {r.text} »</blockquote>
                <p className="title-caps mt-5 text-xs text-muted">{r.author}<Tbc show={r.aConfirmer} /></p>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center">
          <a href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline">
            {content.reviews.googleLink} →
          </a>
        </p>
      </div>
    </section>
  );
}
