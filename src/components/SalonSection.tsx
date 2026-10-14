import Image from "next/image";
import { content } from "@/data/content";
import { salonPhotos } from "@/data/gallery";
import { Swoosh } from "./Decor";
import { highlightIcons } from "./Icons";
import { Reveal } from "./Reveal";

export function SalonSection() {
  const c = content.salon;
  const [main, second] = salonPhotos;
  return (
    <section id="salon" className="stripes py-24" aria-labelledby="salon-titre">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 md:grid-cols-2 md:px-6">
        <Reveal>
          <p className="eyebrow">Le salon</p>
          <Swoosh align="start" className="my-4" />
          <h2 id="salon-titre" className="font-display text-4xl font-semibold leading-tight md:text-5xl">{c.title}</h2>
          {c.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mt-5 leading-relaxed text-cream/85">{p}</p>
          ))}
        </Reveal>
        <Reveal delay={150} className="relative pb-16 md:pb-24">
          <div className="relative ml-auto aspect-[3/4] w-4/5 overflow-hidden rounded-lg">
            <Image src={main.src} alt={main.alt} fill sizes="(min-width: 768px) 40vw, 80vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 aspect-[4/3] w-3/5 overflow-hidden rounded-lg border-4 border-ink">
            <Image src={second.src} alt={second.alt} fill sizes="(min-width: 768px) 30vw, 60vw" className="object-cover" />
          </div>
        </Reveal>
      </div>

      <ul className="mx-auto mt-16 grid max-w-6xl gap-4 px-4 md:grid-cols-3 md:px-6">
        {c.highlights.map((h, i) => {
          const Icon = highlightIcons[h.icon as keyof typeof highlightIcons];
          return (
            <li key={h.title}>
              <Reveal delay={i * 120} className="h-full rounded-lg border border-ink-line bg-ink-soft p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="title-caps mt-5 text-sm">{h.title}</h3>
                <p className="mt-2 text-sm text-muted">{h.text}</p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
