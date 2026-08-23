"use client";

import Reveal from "@/components/Reveal";

const offerings = [
  {
    title: "Sleep Products",
    description:
      "Blankets, sheets, and pillows chosen for what actually touches your body through the night, not what photographs well.",
    icon: (
      <>
        <rect x="6" y="14" width="28" height="18" rx="1" />
        <path d="M6 20h28M14 14v18M26 14v18" />
      </>
    ),
  },
  {
    title: "Sleep Services",
    description:
      "Guidance built around your actual routine, not generic advice copied from a wellness blog.",
    icon: (
      <>
        <circle cx="20" cy="20" r="14" />
        <path d="M14 22c1.5 2.5 4 4 6 4s4.5-1.5 6-4M15 16h.01M25 16h.01" />
      </>
    ),
  },
  {
    title: "Sleep Experiences",
    description:
      "Curated moments designed to help you slow down, disconnect, and genuinely rest.",
    icon: <path d="M28 22a10 10 0 11-10-16 8 8 0 0010 16z" />,
  },
];

export default function Offerings() {
  return (
    <section id="offerings" className="bg-parchment pb-[140px] pt-[150px] text-ink">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[90px] max-w-[640px] text-center">
          <div className="mb-[18px] text-xs uppercase tracking-[3px] text-goldDeep">
            How Sleepifyme Helps
          </div>
          <h2 className="font-display text-[clamp(30px,3.6vw,44px)] font-medium leading-[1.2] text-midnight">
            Three ways we look after your sleep
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {offerings.map((item, index) => (
            <div
              key={item.title}
              className={`px-0 text-left md:px-11 ${
                index > 0
                  ? "mt-14 border-t border-midnight/10 pt-12 md:mt-0 md:border-l md:border-t-0 md:pt-0"
                  : ""
              }`}
            >
              <svg
                viewBox="0 0 40 40"
                className="mb-7 h-[38px] w-[38px] fill-none stroke-goldDeep stroke-[1.2]"
              >
                {item.icon}
              </svg>
              <h3 className="mb-3.5 font-display text-2xl font-medium text-midnight">
                {item.title}
              </h3>
              <p className="max-w-[280px] text-[14.5px] leading-[1.75] text-taupe">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
