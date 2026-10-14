import Image from "next/image";
import { content } from "@/data/content";
import { salonPhotos } from "@/data/gallery";
import { SectionTitle } from "./SectionTitle";

export function Salon() {
  const c = content.salon;
  const [main, second] = salonPhotos;
  return (
    <section id="salon" className="py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 md:grid-cols-2 md:px-6">
        <div>
          <SectionTitle eyebrow={c.eyebrow} title={c.title} />
          {c.paragraphs.map((p) => (
            <p key={p} className="mt-5 text-cream/85">{p}</p>
          ))}
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink-line pt-8">
            {c.highlights.map((h) => (
              <div key={h.label}>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted">{h.label}</dt>
                <dd className="mt-1 font-display text-xl text-gold">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative pb-16 md:pb-24">
          <div className="relative ml-auto aspect-[3/4] w-4/5 overflow-hidden rounded-2xl">
            <Image src={main.src} alt={main.alt} fill sizes="(min-width: 768px) 40vw, 80vw" className="object-cover" />
          </div>
          {second && (
            <div className="absolute bottom-0 left-0 aspect-[4/3] w-3/5 overflow-hidden rounded-2xl border-4 border-ink">
              <Image src={second.src} alt={second.alt} fill sizes="(min-width: 768px) 30vw, 60vw" className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
