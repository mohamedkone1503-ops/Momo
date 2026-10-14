import Link from "next/link";
import { content } from "@/data/content";
import { fullAddress, placeholders, site } from "@/data/site";
import { SectionTitle } from "./SectionTitle";
import { Tbc } from "./Tbc";

export function Contact() {
  const c = content.contact;
  const mapQuery = encodeURIComponent(`${site.name}, ${fullAddress}`);
  return (
    <section id="contact" className="border-t border-ink-line py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:px-6">
        <div>
          <SectionTitle eyebrow={c.eyebrow} title={c.title} />
          <address className="mt-8 not-italic">
            <p className="font-display text-2xl">{site.address.street}</p>
            <p className="text-muted">{site.address.postalCode} {site.address.city}<Tbc show={placeholders.postalCode} /></p>
            <p className="mt-2 text-sm text-muted">{c.access}<Tbc /></p>
            <p className="mt-6">
              <a href={`tel:${site.phoneHref}`} className="text-lg font-semibold hover:text-gold">{site.phone}</a>
              <Tbc show={placeholders.phone} />
            </p>
          </address>

          <h3 className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Horaires<Tbc show={placeholders.hours} />
          </h3>
          <table className="mt-4 w-full max-w-sm text-sm">
            <tbody>
              {site.hours.map((h) => (
                <tr key={h.day} className="border-b border-ink-line">
                  <th scope="row" className="py-2.5 text-left font-medium">{h.day}</th>
                  <td className={`py-2.5 text-right ${h.open ? "" : "text-muted"}`}>
                    {h.open ? `${h.open.replace(":", "h")} – ${h.close!.replace(":", "h")}` : "Fermé"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link
            href="/reservation"
            className="mt-10 inline-block rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-ink hover:bg-gold-light"
          >
            Prendre rendez-vous
          </Link>
        </div>

        <div className="min-h-[360px] overflow-hidden rounded-2xl border border-ink-line">
          <iframe
            title={`Plan d'accès — ${site.name}`}
            src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
            className="h-full min-h-[360px] w-full grayscale invert-[0.9] hue-rotate-180"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
