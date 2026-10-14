import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Tbc } from "@/components/Tbc";
import { bookingConfig } from "@/data/booking";
import { content } from "@/data/content";
import { placeholders, site } from "@/data/site";
import { parisNow } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réserve ton créneau",
  description: `Prends rendez-vous en ligne chez ${site.name}, barber afro au ${site.address.street}, Paris 10e. Dégradé, contours, barbe, coupe enfant.`,
  alternates: { canonical: "/reservation" },
};

export default async function ReservationPage({ searchParams }: { searchParams: Promise<{ prestation?: string }> }) {
  const { prestation } = await searchParams;
  const t = content.booking;
  const closedDays = site.hours.map((h, i) => (h.slots.length ? -1 : i)).filter((i) => i >= 0);

  return (
    <>
      <Header />
      <main id="contenu" className="stripes min-h-screen pb-24 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h1 className="text-center font-display text-4xl font-semibold md:text-5xl">{t.title}</h1>
          <p className="mt-3 text-center text-muted">{t.subtitle}</p>

          <div className="mt-10 rounded-lg border border-ink-line bg-ink-soft p-5 md:p-10">
            {bookingConfig.mode === "externe" ? (
              <ExternalBooking />
            ) : (
              <BookingWizard today={parisNow().date} closedDays={closedDays} initialService={prestation} />
            )}
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Une question ? <a href={`tel:${site.phoneHref}`} className="text-cream hover:text-gold">{site.phone}</a>
            <Tbc show={placeholders.phone} />
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Mode « externe » : bouton (et widget si possible) vers Planity, Booksy… */
function ExternalBooking() {
  const ext = bookingConfig.external;
  return (
    <div className="text-center">
      <p className="text-cream/85">La réservation se fait sur {ext.provider}.</p>
      {ext.embed && (
        <iframe src={ext.url} title={`Réservation ${ext.provider}`} className="mt-6 h-[720px] w-full rounded-lg border border-ink-line bg-white" loading="lazy" />
      )}
      <a href={ext.url} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">
        Réserver sur {ext.provider}
      </a>
      <p className="mx-auto mt-6 max-w-md text-xs text-muted">{bookingConfig.rules}</p>
    </div>
  );
}
