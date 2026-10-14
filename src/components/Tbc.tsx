/**
 * Badge « À confirmer » visible uniquement en développement (npm run dev)
 * pour repérer les données provisoires. Invisible en production.
 */
export function Tbc({ show = true }: { show?: boolean }) {
  if (!show || process.env.NODE_ENV === "production") return null;
  return (
    <span
      title="Donnée provisoire : à remplacer dans src/data/"
      className="ml-2 inline-block rounded border border-dashed border-amber-400 px-1.5 py-0.5 align-middle font-sans text-[10px] font-semibold not-italic uppercase tracking-wider text-amber-300"
    >
      À confirmer
    </span>
  );
}
