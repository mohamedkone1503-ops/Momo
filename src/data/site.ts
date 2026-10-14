/**
 * INFORMATIONS PRATIQUES DU SALON
 * ------------------------------------------------------------------
 * Toutes les valeurs « [À CONFIRMER] » sont provisoires.
 * Pour les retrouver : grep -rn "À CONFIRMER" src/
 */

export const site = {
  name: "Flex Hairstyle",
  tagline: "Le barber afro du Château d'Eau",
  address: {
    street: "43 rue du Château d'Eau",
    postalCode: "75010",
    city: "Paris",
    country: "FR",
  },
  // [À CONFIRMER] Coordonnées GPS approximatives
  geo: { lat: 48.8718, lng: 2.3567 },

  // [À CONFIRMER] Accès transports (à vérifier)
  access: [
    { station: "Château d'Eau", lines: ["4"] },
    { station: "Jacques Bonsergent", lines: ["5"] },
    { station: "Strasbourg Saint-Denis", lines: ["4", "8", "9"] },
  ],

  phone: "01 00 00 00 00", // [À CONFIRMER]
  phoneHref: "+33100000000", // [À CONFIRMER] même numéro au format international
  email: "contact@flex-hairstyle.fr", // [À CONFIRMER]
  url: "https://www.flex-hairstyle.fr", // [À CONFIRMER] nom de domaine définitif

  social: {
    instagramHandle: "flexhairstyle_a_confirmer", // [À CONFIRMER]
    instagram: "https://www.instagram.com/flexhairstyle_a_confirmer", // [À CONFIRMER]
    snapchat: "https://www.snapchat.com/add/flexhairstyle_a_confirmer", // [À CONFIRMER]
    tiktok: "https://www.tiktok.com/@flexhairstyle_a_confirmer", // [À CONFIRMER]
  },

  // [À CONFIRMER] Lien vers la fiche Google (avis)
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Flex+Hairstyle+43+rue+du+Ch%C3%A2teau+d%27Eau+Paris",

  /**
   * [À CONFIRMER] Horaires provisoires. Format 24 h « HH:MM ».
   * Plusieurs plages possibles par jour (ex. pause déjeuner). Tableau vide = fermé.
   */
  hours: [
    { day: "Lundi", schema: "Monday", slots: [["10:00", "20:00"]] },
    { day: "Mardi", schema: "Tuesday", slots: [["10:00", "20:00"]] },
    { day: "Mercredi", schema: "Wednesday", slots: [["10:00", "20:00"]] },
    { day: "Jeudi", schema: "Thursday", slots: [["10:00", "20:00"]] },
    { day: "Vendredi", schema: "Friday", slots: [["10:00", "20:00"]] },
    { day: "Samedi", schema: "Saturday", slots: [["10:00", "20:00"]] },
    { day: "Dimanche", schema: "Sunday", slots: [] },
  ] as { day: string; schema: string; slots: [string, string][] }[],
  hoursSummary: "Lun – Sam : 10h – 20h · Dim : fermé", // [À CONFIRMER] résumé affiché dans le footer

  priceRange: "€",

  /** Logo : mettez le vrai fichier dans public/logo.svg puis renseignez "/logo.svg". null = logo recréé en texte. */
  logoSrc: null as string | null,
};

/** Affiche les badges « À confirmer » (mode développement uniquement). */
export const placeholders = {
  phone: true,
  email: true,
  hours: true,
  social: true,
  access: true,
};

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.name}, ${fullAddress}`
)}`;
