/**
 * INFORMATIONS GÉNÉRALES DU SALON
 * ------------------------------------------------------------------
 * Toutes les valeurs marquées « [À CONFIRMER] » sont provisoires.
 * Recherchez « À CONFIRMER » dans src/data/ pour toutes les retrouver.
 */

export const site = {
  name: "Flex Hairstyle",
  shortName: "Flex",
  tagline: "Barber shop à Paris 10e",
  // Adresse lue sur l'enseigne de la façade
  address: {
    street: "43 rue du Château d'Eau",
    postalCode: "75010", // [À CONFIRMER]
    city: "Paris",
    country: "FR",
  },
  // [À CONFIRMER] Coordonnées GPS approximatives (rue du Château d'Eau)
  geo: { lat: 48.8718, lng: 2.3567 },

  // [À CONFIRMER] Numéro provisoire
  phone: "01 00 00 00 00",
  phoneHref: "+33100000000",
  // [À CONFIRMER] Adresse e-mail provisoire
  email: "contact@flex-hairstyle.fr",
  // [À CONFIRMER] Nom de domaine définitif (utilisé pour le SEO et le sitemap)
  url: "https://www.flex-hairstyle.fr",

  social: {
    // [À CONFIRMER] Comptes visibles sur l'enseigne (Instagram, Snapchat) — identifiants à fournir
    instagram: "https://www.instagram.com/flexhairstyle_a_confirmer",
    snapchat: "https://www.snapchat.com/add/flexhairstyle_a_confirmer",
  },

  // [À CONFIRMER] Horaires provisoires
  // Format 24 h « HH:MM ». null = fermé.
  hours: [
    { day: "Lundi", short: "Mo", open: "10:00", close: "20:00" },
    { day: "Mardi", short: "Tu", open: "10:00", close: "20:00" },
    { day: "Mercredi", short: "We", open: "10:00", close: "20:00" },
    { day: "Jeudi", short: "Th", open: "10:00", close: "20:00" },
    { day: "Vendredi", short: "Fr", open: "10:00", close: "20:00" },
    { day: "Samedi", short: "Sa", open: "10:00", close: "20:00" },
    { day: "Dimanche", short: "Su", open: null, close: null },
  ] as { day: string; short: string; open: string | null; close: string | null }[],

  // [À CONFIRMER] Fourchette de prix affichée pour le référencement
  priceRange: "€",
};

/** Clés à passer à <Tbc/> pour signaler visuellement (en local) une donnée provisoire. */
export const placeholders = {
  phone: true,
  email: true,
  hours: true,
  social: true,
  postalCode: true,
} as const;

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
