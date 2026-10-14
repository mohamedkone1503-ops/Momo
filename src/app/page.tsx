import { BarberPole } from "@/components/Decor";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Infos } from "@/components/Infos";
import { Reviews } from "@/components/Reviews";
import { SalonSection } from "@/components/SalonSection";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenu">
        <Hero />
        <BarberPole className="h-1" />
        <SalonSection />
        <Services />
        <Gallery />
        <Reviews />
        <Infos />
      </main>
      <Footer />
    </>
  );
}
