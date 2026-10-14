"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { content } from "@/data/content";
import { galleryPhotos } from "@/data/gallery";
import { SectionTitle } from "./SectionTitle";

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + galleryPhotos.length) % galleryPhotos.length)),
    []
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  const current = index !== null ? galleryPhotos[index] : null;

  return (
    <section id="galerie" className="border-t border-ink-line py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow={content.gallery.eyebrow} title={content.gallery.title} />
        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
          {galleryPhotos.map((p, i) => (
            <button
              key={`${p.src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`group relative overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-gold ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
              aria-label={`Agrandir : ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-ink/20 transition group-hover:bg-transparent" aria-hidden />
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
          onClick={close}
        >
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button type="button" onClick={close} className="absolute right-4 top-4 h-11 w-11 text-3xl" aria-label="Fermer">×</button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 text-4xl text-cream/80 hover:text-gold"
            aria-label="Photo précédente"
          >‹</button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 text-4xl text-cream/80 hover:text-gold"
            aria-label="Photo suivante"
          >›</button>
        </div>
      )}
    </section>
  );
}
