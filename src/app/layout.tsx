import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { site, fullAddress } from "@/data/site";
import { services } from "@/data/services";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const description = `${site.name}, barber shop au ${fullAddress}. Coupe homme, dégradé, contours et taille de barbe. Réservez en ligne.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Barbier Paris 10e, ${site.address.street}`,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    "barbier Paris 10",
    "barber shop Paris",
    "coiffeur homme Château d'Eau",
    "dégradé Paris",
    "taille de barbe Paris 10e",
    "Flex Hairstyle",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Barber shop Paris 10e`,
    description,
    images: [{ url: "/photos/salon-interieur.jpg", width: 860, height: 645, alt: "Intérieur du salon Flex Hairstyle" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#0b0b0c" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: site.name,
  url: site.url,
  image: `${site.url}/photos/facade.jpg`,
  telephone: site.phoneHref,
  email: site.email,
  priceRange: site.priceRange,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: site.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${
        { Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" }[h.short]
      }`,
      opens: h.open,
      closes: h.close,
    })),
  sameAs: Object.values(site.social),
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    price: s.price,
    priceCurrency: "EUR",
    itemOffered: { "@type": "Service", name: s.name },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
