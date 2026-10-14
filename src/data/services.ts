/**
 * PRESTATIONS ET TARIFS
 * ------------------------------------------------------------------
 * Tarifs lus (partiellement) sur le panneau « Les tarifs » visible en
 * photo : tous à vérifier. Durées provisoires.
 * `aConfirmer: true` affiche un petit badge en mode développement.
 */

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number; // en euros
  duration: number; // en minutes (sert à la réservation)
  aConfirmer?: boolean;
};

export const services: Service[] = [
  {
    id: "coupe",
    name: "Coupe homme",
    description: "Coupe aux ciseaux ou à la tondeuse, finitions au rasoir.",
    price: 15, // [À CONFIRMER]
    duration: 30, // [À CONFIRMER]
    aConfirmer: true,
  },
  {
    id: "coupe-barbe",
    name: "Coupe + contour + barbe",
    description: "La coupe complète avec taille et contours de barbe nets.",
    price: 18, // [À CONFIRMER]
    duration: 45, // [À CONFIRMER]
    aConfirmer: true,
  },
  {
    id: "barbe",
    name: "Barbe & contours",
    description: "Taille, dégradé et traçage précis de la barbe.",
    price: 10, // [À CONFIRMER]
    duration: 20, // [À CONFIRMER]
    aConfirmer: true,
  },
  {
    id: "coupe-couleur",
    name: "Coupe + couleur noire",
    description: "Coupe suivie d'une coloration noire pour un rendu intense.",
    price: 25, // [À CONFIRMER]
    duration: 60, // [À CONFIRMER]
    aConfirmer: true,
  },
  {
    id: "enfant",
    name: "Coupe enfant",
    description: "Pour les moins de 12 ans.", // [À CONFIRMER] âge limite
    price: 12, // [À CONFIRMER]
    duration: 30, // [À CONFIRMER]
    aConfirmer: true,
  },
];

export function getService(id: string) {
  return services.find((s) => s.id === id);
}
