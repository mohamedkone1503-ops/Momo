/**
 * PHOTOS DU SALON
 * ------------------------------------------------------------------
 * Fichiers dans public/photos/. Pour ajouter une photo : déposez-la
 * dans ce dossier puis ajoutez une ligne ci-dessous.
 */

export type Photo = { src: string; alt: string; width: number; height: number };

export const heroPhoto: Photo = {
  src: "/photos/salon-interieur.jpg",
  alt: "Intérieur du salon Flex Hairstyle : fauteuils de barbier noirs, murs rayés noir et blanc",
  width: 860,
  height: 645,
};

export const salonPhotos: Photo[] = [
  {
    src: "/photos/facade.jpg",
    alt: "Façade de Flex Hairstyle au 43 rue du Château d'Eau avec son enseigne noir et or",
    width: 860,
    height: 1147,
  },
  {
    src: "/photos/salon-postes.jpg",
    alt: "Postes de coupe et fauteuils de barbier en cuir noir",
    width: 860,
    height: 645,
  },
];

export const galleryPhotos: Photo[] = [
  heroPhoto,
  {
    src: "/photos/salon-fauteuils.jpg",
    alt: "Deux fauteuils de barbier face au grand miroir",
    width: 860,
    height: 645,
  },
  {
    src: "/photos/outils.jpg",
    alt: "Tondeuses, ciseaux, peignes et blaireau sur le plan de travail",
    width: 860,
    height: 645,
  },
  {
    src: "/photos/salon-postes.jpg",
    alt: "Postes de coupe éclairés avec produits de coiffage",
    width: 860,
    height: 645,
  },
  {
    src: "/photos/facade.jpg",
    alt: "Enseigne Flex Hairstyle et vitrine du salon",
    width: 860,
    height: 1147,
  },
];
