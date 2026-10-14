/**
 * ÉQUIPE
 * ------------------------------------------------------------------
 * [À CONFIRMER] Noms et photos des barbiers. Photo : déposez-la dans
 * public/barbiers/ et indiquez son chemin (null = initiale affichée).
 * Le nombre de barbiers = nombre de rendez-vous possibles en même temps.
 */
export type Barber = { id: string; name: string; specialty: string; photo: string | null; aConfirmer?: boolean };

export const barbers: Barber[] = [
  { id: "barbier-1", name: "Barbier 1", specialty: "Dégradés & designs", photo: null, aConfirmer: true },
  { id: "barbier-2", name: "Barbier 2", specialty: "Barbe & contours", photo: null, aConfirmer: true },
];

export const getBarber = (id?: string | null) => barbers.find((b) => b.id === id);
