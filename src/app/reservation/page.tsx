import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Tbc } from "@/components/Tbc";
import { bookingRules } from "@/data/booking";
import { content } from "@/data/content";
import { placeholders, site } from "@/data/site";
import { addDays, hoursFor, parisNow } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réserver un rendez-vous",
  description: `Prenez rendez-vous en ligne chez ${site.name}, barbier au ${site.address.street} à Paris : coupe, dégradé, barbe.`,
  alternates: { canonical: "/reservation" },
};

export default async function ReservationPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const today = parisNow().date;
  const days = Array.from({ length: bookingRules.maxDaysAhead + 1 }, (_, i) => {
    const date = addDays(today, i);
    const d = new Date(`${date}T12:00:00Z`);
    const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", { ...o, timeZone: "UTC" }).format(d);
    return {
      date,
      weekday: fmt({ weekday: "long" }),
      label: fmt({ day: "numeric", month: "long" }),
      month: fmt({ month: "short" }),
      closed: !hoursFor(date).open,
    };
  });

  return (
    <>
      <Header />
      <main className="stripes min-h-screen pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{site.name}</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">{content.booking.title}</h1>
          <p className="mt-4 text-muted">{content.booking.intro}</p>
          <p className="mt-2 text-sm text-muted">
            Une question ? <a href={`tel:${site.phoneHref}`} className="text-cream hover:text-gold">{site.phone}</a>
            <Tbc show={placeholders.phone} />
          </p>
          <div className="mt-12 rounded-3xl border border-ink-line bg-ink/90 p-5 md:p-10">
            <BookingForm days={days} initialService={service} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
