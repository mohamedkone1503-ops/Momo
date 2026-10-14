import { Footer } from "./Footer";
import { Header } from "./Header";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenu" className="mx-auto max-w-3xl px-4 pb-24 pt-32 md:px-6">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-amber-300">Modèle à compléter : les mentions [À CONFIRMER] sont à remplacer.</p>
        <div className="mt-10 space-y-8 leading-relaxed text-cream/85 [&_h2]:mb-2 [&_h2]:text-xs [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-[0.2em] [&_h2]:text-gold [&_a]:text-gold [&_a]:underline">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
