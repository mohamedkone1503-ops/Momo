/**
 * RÉSERVATION
 * ------------------------------------------------------------------
 */
export const bookingConfig = {
  /**
   * "interne" : formulaire de réservation du site (avec /admin).
   * "externe" : la page /reservation affiche un bouton (et un widget si
   * possible) vers un outil existant (Planity, Booksy…).
   */
  mode: "interne" as "interne" | "externe",
  external: {
    provider: "Planity", // [À CONFIRMER]
    url: "https://www.planity.com/", // [À CONFIRMER] lien de la page du salon
    embed: false, // true = intégrer la page dans un iframe (si l'outil l'autorise)
  },

  slotStepMinutes: 15,
  maxDaysAhead: 30,
  minNoticeMinutes: 60,
  timeZone: "Europe/Paris",

  // [À CONFIRMER] Règles affichées sur la page de réservation et dans l'e-mail
  rules:
    "En cas de retard de plus de 10 minutes, le rendez-vous pourra être décalé. Pour annuler, merci de prévenir au moins 2 heures avant.",
};
