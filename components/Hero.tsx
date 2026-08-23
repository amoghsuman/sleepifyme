import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(201,162,75,0.10),transparent_60%),linear-gradient(180deg,#0A1128_0%,#070C1F_55%,#05070F_100%)] text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.22)_0%,rgba(201,162,75,0.07)_42%,transparent_70%)] blur-[6px]"
      />

      <div className="relative z-[2] max-w-[820px] px-6">
        <div className="mb-7 flex animate-rise-in items-center justify-center gap-4 text-xs uppercase tracking-[4px] text-goldSoft opacity-0 [animation-delay:150ms]">
          <span className="h-px w-[34px] bg-gold/[0.28]" />
          Products &nbsp;&middot;&nbsp; Services &nbsp;&middot;&nbsp; Experiences
          <span className="h-px w-[34px] bg-gold/[0.28]" />
        </div>

        <h1 className="mb-6 animate-rise-in font-display text-[clamp(42px,6.4vw,84px)] font-medium leading-[1.08] tracking-[-0.01em] text-parchment opacity-0 [animation-delay:350ms]">
          Everything your sleep needs,
          <br />
          <em className="font-normal italic text-goldSoft">in one place.</em>
        </h1>

        <p className="mx-auto mb-11 max-w-[520px] animate-rise-in text-[17px] leading-[1.7] text-parchment/[0.72] opacity-0 [animation-delay:550ms]">
          Thoughtfully sourced textiles, considered guidance, and quiet
          moments of rest, curated for how India actually sleeps.
        </p>

        <div className="flex animate-rise-in flex-wrap items-center justify-center gap-7 opacity-0 [animation-delay:750ms]">
          <Link
            href="#offerings"
            className="inline-block rounded-[2px] bg-gold px-9 py-4 text-[13px] font-bold uppercase tracking-[1.6px] text-ink transition-all duration-300 hover:-translate-y-px hover:bg-goldSoft"
          >
            Explore Sleepifyme
          </Link>
          <Link
            href="#quote"
            className="border-b border-gold/[0.28] pb-[3px] text-[13px] uppercase tracking-[1.4px] text-parchment transition-colors duration-300 hover:border-gold hover:text-goldSoft"
          >
            Our Philosophy
          </Link>
        </div>
      </div>

      <div className="absolute bottom-[38px] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2.5 text-goldSoft opacity-60">
        <div className="h-9 w-px animate-stem bg-gradient-to-b from-gold to-transparent" />
        <span className="text-[10px] tracking-[2px]">SCROLL</span>
      </div>
    </section>
  );
}
