import { Swoosh } from "./Decor";

export function SectionTitle({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Swoosh className="mb-5" />
      <h2 id={id} className="font-display text-4xl font-semibold leading-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
    </div>
  );
}
