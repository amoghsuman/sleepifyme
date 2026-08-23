"use client";

import Reveal from "@/components/Reveal";

const trustItems = [
  { num: "30 Nights", label: "Sleep guarantee, no questions asked" },
  { num: "Pan-India", label: "Free shipping on every order" },
  { num: "Panipat & Jodhpur", label: "Sourced and made with intention" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-midnight/[0.08] bg-parchment py-20">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
        <div className="flex flex-wrap justify-between gap-9">
          {trustItems.map((item) => (
            <Reveal key={item.num} className="min-w-[220px] flex-1 px-5 text-center">
              <span className="mb-2.5 block font-display text-[15px] italic text-goldDeep">
                {item.num}
              </span>
              <p className="text-sm leading-[1.6] tracking-[0.2px] text-midnight">
                {item.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
