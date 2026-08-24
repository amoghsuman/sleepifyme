import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PullQuote from "@/components/PullQuote";
import OfferingsDetail from "@/components/OfferingsDetail";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sleep is often treated as an afterthought. We see it differently, as the foundation everything else is built on. Learn how Sleepifyme looks after your sleep.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />

      <section className="relative flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#0A1128_0%,#070C1F_55%,#05070F_100%)] px-6 pb-28 pt-[200px] text-center">
        <h1 className="font-display text-[clamp(42px,6.4vw,84px)] font-medium leading-[1.08] tracking-[-0.01em] text-parchment">
          About Sleepifyme
        </h1>
      </section>

      <PullQuote />

      <OfferingsDetail />

      <section className="bg-ink py-20">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
          <p className="mx-auto max-w-[780px] text-left text-[13px] font-normal leading-[1.7] text-parchment/50">
            Sourced and made with intention, from Panipat to Jodhpur.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
