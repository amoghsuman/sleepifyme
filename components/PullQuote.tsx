"use client";

import Reveal from "@/components/Reveal";

export default function PullQuote() {
  return (
    <section id="quote" className="relative overflow-hidden bg-ink py-[170px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.06),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-[1240px] px-6 sm:px-10">
        <Reveal className="relative z-[1] mx-auto max-w-[780px] text-left">
          <span className="mb-3.5 block font-display text-[64px] leading-[0.5] text-goldDeep">
            &ldquo;
          </span>
          <p className="font-display text-[clamp(26px,3.4vw,40px)] font-normal italic leading-[1.5] text-parchment">
            Sleep is often treated as an afterthought. We see it differently,
            as the foundation everything else is built on.
          </p>
          <div className="mt-9 text-[12.5px] uppercase tracking-[2px] text-goldSoft">
            &mdash; The Sleepifyme Philosophy
          </div>
        </Reveal>
      </div>
    </section>
  );
}
