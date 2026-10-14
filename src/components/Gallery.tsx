"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/data/content";
import { galleryPhotos } from "@/data/gallery";
import { placeholders, site } from "@/data/site";
import { InstagramIcon } from "./Icons";
import { SectionTitle } from "./SectionTitle";
import { Tbc } from "./Tbc";

const real = galleryPhotos.filter((p): p is typeof p & { src: string } => p.src !== null);

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + real.length) % real.length)), []);

  useEffect(() => {
    if (index === null) return;
    closeBtn.current?.focus();
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

  const current = index !== null ? real[index] : null;

  return (
    <section id="galerie" className="py-24" aria-labelledby="galerie-titre">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle id="galerie-titre" title={content.gallery.title} subtitle={content.gallery.subtitle} />

        <div className="mt-14 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4">
          {galleryPhotos.map((p, i) => {
            const span = i === 0 ? "col-span-2 row-span-2" : "";
            if (!p.src) {
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gold/40 bg-ink-soft p-4 text-center ${span}`}
                >
                  <span className="title-caps text-xs text-gold">{p.alt}</span>
                  <span className="text-[11px] text-muted">Photo de coupe à venir</span>
                  <Tbc />
                </div>
              );
            }
            const realIndex = real.findIndex((r) => r === p);
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setIndex(realIndex);
                }}
                className={`group relative overflow-hidden rounded-lg ${span}`}
                aria-label={`Agrandir la photo : ${p.alt}`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-ink/20 transition group-hover:bg-transparent" aria-hidden />
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline max-w-full">
            <InstagramIcon className="h-4 w-4 shrink-0" />
            <span className="min-w-0 break-all">Suivre @{site.social.instagramHandle}</span>
          </a>
          <Tbc show={placeholders.social} />
        </div>
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index! + 1} sur ${real.length} : ${current.alt}`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4"
          onClick={close}
        >
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button ref={closeBtn} type="button" onClick={close} className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center text-3xl hover:text-gold" aria-label="Fermer">×</button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-4xl text-cream/80 hover:text-gold"
            aria-label="Photo précédente"
          >‹</button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-4xl text-cream/80 hover:text-gold"
            aria-label="Photo suivante"
          >›</button>
        </div>
      )}
    </section>
  );
}
