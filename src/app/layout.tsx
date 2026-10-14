import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { CookieBanner } from "@/components/CookieBanner";
import { services } from "@/data/services";
import { site } from "@/data/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const title = "Flex Hairstyle | Barber afro à Paris 10e, Château d'Eau";
const description =
  "Barber shop spécialiste des cheveux afro rue du Château d'Eau, Paris 10e. Dégradés, contours, barbe, coupe enfant. Réservez en ligne.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description,
  keywords: [
    "barbier afro Paris",
    "barber shop Paris 10",
    "coiffeur afro homme Château d'Eau",
    "dégradé afro Paris",
    "taille de barbe Paris 10",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title,
    description,
    images: [{ url: "/photos/salon-interieur.jpg", width: 860, height: 645, alt: "Intérieur du salon Flex Hairstyle" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/photos/salon-interieur.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#141414", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  additionalType: "https://en.wikipedia.org/wiki/Barber",
  "@id": `${site.url}/#salon`,
  name: site.name,
  description,
  url: site.url,
  image: [`${site.url}/photos/facade.jpg`, `${site.url}/photos/salon-interieur.jpg`],
  telephone: site.phoneHref,
  email: site.email,
  priceRange: site.priceRange,
  currenciesAccepted: "EUR",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: site.hours.flatMap((h) =>
    h.slots.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.schema}`,
      opens,
      closes,
    }))
  ),
  sameAs: [site.social.instagram, site.social.snapchat, site.social.tiktok],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Prestations",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      price: s.price,
      priceCurrency: "EUR",
      itemOffered: { "@type": "Service", name: s.name, description: s.description },
    })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[6px] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
          Aller au contenu
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
