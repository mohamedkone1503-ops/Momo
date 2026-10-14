/**
 * GALERIE
 * ------------------------------------------------------------------
 * Photos dans public/photos/. Les entrées avec src: null sont des
 * emplacements réservés aux photos de coupes [À CONFIRMER] : déposez
 * l'image dans public/photos/ et remplacez null par son chemin.
 */
export type Photo = { src: string | null; alt: string; width: number; height: number };

export const heroPhoto = {
  src: "/photos/salon-interieur.jpg",
  alt: "Intérieur du salon Flex Hairstyle : fauteuils barbier noirs, murs rayés noir et blanc",
  width: 860,
  height: 645,
};

export const salonPhotos = [
  {
    src: "/photos/facade.jpg",
    alt: "Façade de Flex Hairstyle au 43 rue du Château d'Eau, enseigne noir et or",
    width: 860,
    height: 1147,
  },
  {
    src: "/photos/salon-postes.jpg",
    alt: "Postes de coupe et fauteuils barbier en cuir noir",
    width: 860,
    height: 645,
  },
];

export const galleryPhotos: Photo[] = [
  heroPhoto,
  { src: "/photos/salon-fauteuils.jpg", alt: "Deux fauteuils barbier face au grand miroir", width: 860, height: 645 },
  { src: "/photos/outils.jpg", alt: "Tondeuses, ciseaux, peignes et blaireau sur le plan de travail", width: 860, height: 645 },
  { src: null, alt: "Dégradé", width: 860, height: 860 }, // [À CONFIRMER] photo de coupe
  { src: "/photos/salon-postes.jpg", alt: "Postes de coupe éclairés et produits de coiffage", width: 860, height: 645 },
  { src: null, alt: "Barbe sculptée", width: 860, height: 860 }, // [À CONFIRMER] photo de coupe
  { src: "/photos/facade.jpg", alt: "Enseigne Flex Hairstyle et vitrine du salon", width: 860, height: 1147 },
  { src: null, alt: "Design / motif", width: 860, height: 860 }, // [À CONFIRMER] photo de coupe
  { src: null, alt: "Coupe enfant", width: 860, height: 860 }, // [À CONFIRMER] photo de coupe
];
