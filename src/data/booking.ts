/**
 * RÈGLES DE RÉSERVATION
 * ------------------------------------------------------------------
 */
export const bookingRules = {
  slotStepMinutes: 30, // un créneau toutes les 30 min
  seats: 2, // [À CONFIRMER] nombre de barbiers pouvant prendre un RDV en même temps
  maxDaysAhead: 30, // réservation possible jusqu'à J+30
  minNoticeMinutes: 60, // pas de RDV moins d'1 h à l'avance
  timeZone: "Europe/Paris",
};
