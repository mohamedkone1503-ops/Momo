import { content } from "@/data/content";
import { fullAddress, mapsDirectionsUrl, placeholders, site } from "@/data/site";
import { ClockIcon, MetroIcon, PhoneIcon, PinIcon } from "./Icons";
import { MapEmbed } from "./MapEmbed";
import { OpenStatus } from "./OpenStatus";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";
import { Social } from "./Social";
import { Tbc } from "./Tbc";
import { fmtTime } from "@/lib/time";

export function Infos() {
  return (
    <section id="infos" className="py-24" aria-labelledby="infos-titre">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle id="infos-titre" title={content.infos.title} />
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <Reveal className="space-y-8">
            <div className="flex gap-4">
              <PinIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <h3 className="title-caps text-xs text-gold">Adresse</h3>
                <p className="mt-1 text-lg">{fullAddress}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MetroIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <h3 className="title-caps text-xs text-gold">Accès<Tbc show={placeholders.access} /></h3>
                <ul className="mt-1 space-y-1 text-sm">
                  {site.access.map((a) => (
                    <li key={a.station}>
                      Métro {a.station} <span className="text-muted">(ligne{a.lines.length > 1 ? "s" : ""} {a.lines.join(", ")})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <PhoneIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <h3 className="title-caps text-xs text-gold">Téléphone</h3>
                <a href={`tel:${site.phoneHref}`} className="mt-1 inline-block text-lg font-semibold hover:text-gold">{site.phone}</a>
                <Tbc show={placeholders.phone} />
              </div>
            </div>

            <div className="flex gap-4">
              <ClockIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div className="flex-1">
                <h3 className="title-caps text-xs text-gold">Horaires<Tbc show={placeholders.hours} /></h3>
                <OpenStatus className="mt-3" />
                <table className="mt-4 w-full max-w-sm text-sm">
                  <caption className="sr-only">Horaires d'ouverture</caption>
                  <tbody>
                    {site.hours.map((h) => (
                      <tr key={h.day} className="border-b border-ink-line last:border-0">
                        <th scope="row" className="py-2 text-left font-medium">{h.day}</th>
                        <td className={`py-2 text-right ${h.slots.length ? "" : "text-muted"}`}>
                          {h.slots.length ? h.slots.map(([o, c]) => `${fmtTime(o)} – ${fmtTime(c)}`).join(" · ") : "Fermé"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="title-caps mb-3 text-xs text-gold">Réseaux<Tbc show={placeholders.social} /></h3>
              <Social />
            </div>
          </Reveal>

          <Reveal delay={150} className="flex flex-col gap-4">
            <div className="flex-1 overflow-hidden rounded-lg border border-ink-line">
              <MapEmbed />
            </div>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <PinIcon className="h-4 w-4" />
              {content.infos.directions}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
