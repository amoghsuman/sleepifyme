import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />

      <main className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(180deg,#0A1128_0%,#070C1F_55%,#05070F_100%)] px-6 py-32 text-center">
        <span className="mb-6 text-xs uppercase tracking-[3px] text-goldSoft">
          404
        </span>
        <h1 className="mb-6 font-display text-[clamp(36px,5vw,64px)] font-medium leading-[1.15] text-parchment">
          This page seems to have
          <br />
          drifted off to sleep.
        </h1>
        <p className="mb-10 max-w-[420px] text-[15px] leading-[1.8] text-parchment/[0.65]">
          We couldn&rsquo;t find what you were looking for. Let&rsquo;s get you
          back to somewhere restful.
        </p>
        <Link
          href="/"
          className="inline-block rounded-[2px] bg-gold px-9 py-4 text-[13px] font-bold uppercase tracking-[1.6px] text-ink transition-all duration-300 hover:-translate-y-px hover:bg-goldSoft"
        >
          Back to Homepage
        </Link>
      </main>

      <Footer />
    </>
  );
}
