import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { fullAddress, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

// [À CONFIRMER] Informations légales à compléter (raison sociale, SIRET, hébergeur…)
const legal = {
  company: "[À CONFIRMER] Raison sociale",
  siret: "[À CONFIRMER] SIRET",
  director: "[À CONFIRMER] Responsable de la publication",
  host: "[À CONFIRMER] Hébergeur du site (nom, adresse)",
};

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 md:px-6">
        <h1 className="font-display text-5xl">Mentions légales</h1>
        <div className="mt-10 space-y-8 text-cream/85">
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">Éditeur</h2>
            <p>{site.name} — {legal.company}</p>
            <p>{fullAddress}</p>
            <p>{legal.siret}</p>
            <p>{legal.director}</p>
            <p>{site.phone} · {site.email}</p>
          </section>
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">Hébergement</h2>
            <p>{legal.host}</p>
          </section>
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">Données personnelles</h2>
            <p>
              Les informations saisies dans le formulaire de réservation (nom, téléphone, e-mail) servent uniquement
              à la gestion de votre rendez-vous et ne sont jamais transmises à des tiers. Vous pouvez demander leur
              suppression à tout moment en nous contactant.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
