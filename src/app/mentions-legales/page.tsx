import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/data/legal";
import { fullAddress, site } from "@/data/site";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>{site.name} — {legal.company}</p>
        <p>{legal.legalForm}</p>
        <p>{fullAddress}</p>
        <p>{legal.siret}</p>
        <p>Téléphone : {site.phone} · E-mail : {site.email}</p>
        <p>{legal.director}</p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>{legal.host}</p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>Les textes, photos, logo et éléments graphiques de ce site sont la propriété de {site.name}. Toute reproduction sans autorisation est interdite.</p>
      </section>
      <section>
        <h2>Données personnelles</h2>
        <p>Voir la <a href="/confidentialite">politique de confidentialité</a>.</p>
      </section>
    </LegalPage>
  );
}
