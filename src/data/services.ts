import data from "./services.json";

/** Les prestations sont éditées dans services.json (fichier unique, cf. brief §3). */
export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number; // euros
  aConfirmer?: boolean;
  supplement?: boolean; // affiché « en supplément »
};

export const services: Service[] = data.services;

export function getService(id: string) {
  return services.find((s) => s.id === id);
}

export const mainServices = services.filter((s) => !s.supplement);
export const extraServices = services.filter((s) => s.supplement);

/** Durée et prix totaux d'une prestation + suppléments. */
export function totals(serviceId: string, extraIds: string[] = []) {
  const items = [serviceId, ...extraIds].map(getService).filter((s): s is Service => !!s);
  return {
    duration: items.reduce((n, s) => n + s.duration, 0),
    price: items.reduce((n, s) => n + s.price, 0),
    label: items.map((s) => s.name).join(" + "),
  };
}
