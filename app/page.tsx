import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Offerings from "@/components/Offerings";
import PersonaGrid from "@/components/PersonaGrid";
import PullQuote from "@/components/PullQuote";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Offerings />
      <PersonaGrid />
      <PullQuote />
      <TrustStrip />
      <Footer />
    </>
  );
}
