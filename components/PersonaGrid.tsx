"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { personas } from "@/lib/personas";

const personaIcons: Record<(typeof personas)[number]["slug"], ReactNode> = {
  adults: (
    <>
      <circle cx="50" cy="34" r="14" />
      <path d="M26 82c0-16 11-28 24-28s24 12 24 28" />
    </>
  ),
  babies: (
    <>
      <circle cx="50" cy="42" r="16" />
      <path d="M34 66c0-8 7-10 16-10s16 2 16 10" opacity={0.7} />
    </>
  ),
  children: (
    <>
      <circle cx="50" cy="36" r="13" />
      <path d="M30 80c0-14 9-24 20-24s20 10 20 24" />
      <path d="M40 80v8M60 80v8" />
    </>
  ),
  pets: (
    <>
      <ellipse cx="50" cy="55" rx="24" ry="16" />
      <circle cx="34" cy="34" r="8" />
      <circle cx="66" cy="34" r="8" />
    </>
  ),
};

export default function PersonaGrid() {
  return (
    <section id="personas" className="bg-midnight py-40">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-20 max-w-[640px] text-center">
          <div className="mb-[18px] text-xs uppercase tracking-[3px] text-goldSoft">
            Shop by Who&rsquo;s Sleeping
          </div>
          <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-medium text-parchment">
            Every sleeper in the house, considered
          </h2>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-px bg-gold/[0.15] sm:grid-cols-2 lg:grid-cols-4">
            {personas.map((persona) => (
              <Link
                key={persona.slug}
                href={`/collections/${persona.slug}`}
                className="block bg-midnight px-8 py-14 text-center transition-colors duration-[400ms] hover:bg-[#0d1638]"
              >
                <div className="mx-auto mb-7 h-16 w-16">
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    className="h-full w-full stroke-gold opacity-85"
                    strokeWidth={0.8}
                  >
                    {personaIcons[persona.slug]}
                  </svg>
                </div>
                <h3 className="mb-3 font-display text-xl font-medium text-parchment">
                  {persona.title}
                </h3>
                <p className="text-[13px] leading-[1.7] text-parchment/[0.55]">
                  {persona.description}
                </p>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
