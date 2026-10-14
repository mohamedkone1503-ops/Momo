/**
 * AVIS CLIENTS
 * ------------------------------------------------------------------
 * [À CONFIRMER] Avis PROVISOIRES fournis par le brief : à remplacer par
 * de vrais avis Google avant la mise en ligne.
 */
export type Review = { author: string; text: string; rating: number; aConfirmer?: boolean };

export const reviews: Review[] = [
  { author: "Karim", text: "Meilleur dégradé que j'ai eu à Paris, propre et rapide.", rating: 5, aConfirmer: true },
  { author: "Moussa", text: "Super accueil, je viens avec mon fils chaque mois.", rating: 5, aConfirmer: true },
  { author: "Jordan", text: "Contours ultra précis, ils savent travailler les cheveux afro.", rating: 5, aConfirmer: true },
];
