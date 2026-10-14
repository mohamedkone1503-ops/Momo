import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { ResetConsent } from "@/components/ResetConsent";
import { legal } from "@/data/legal";
import { fullAddress, site } from "@/data/site";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité">
      <section>
        <h2>Responsable du traitement</h2>
        <p>{site.name} — {legal.company}, {fullAddress}. Contact : {site.email}</p>
      </section>
      <section>
        <h2>Données collectées</h2>
        <p>Lors d'une réservation : prénom, nom, téléphone, e-mail, message facultatif, prestation, date et coiffeur choisis.</p>
      </section>
      <section>
        <h2>Finalité et base légale</h2>
        <p>Ces données servent uniquement à gérer ton rendez-vous (confirmation, rappel, annulation). Base légale : ton consentement et l'exécution de la prestation demandée. Elles ne sont ni vendues ni transmises à des tiers à des fins commerciales.</p>
      </section>
      <section>
        <h2>Durée de conservation</h2>
        <p>{legal.retentionMonths} mois après le rendez-vous, puis suppression.</p>
      </section>
      <section>
        <h2>Tes droits</h2>
        <p>Tu peux demander l'accès, la rectification ou la suppression de tes données en écrivant à {site.email}. Tu peux aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience. La carte Google Maps, si tu l'affiches, peut déposer des cookies de Google : elle ne se charge qu'après ton accord. Ton choix est enregistré dans ton navigateur.</p>
        <ResetConsent />
      </section>
    </LegalPage>
  );
}
