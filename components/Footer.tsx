"use client";

const shopLinks = ["Sleep Products", "Sleep Services", "Sleep Experiences"];
const companyLinks = ["About", "Journal", "Contact", "Policies"];

export default function Footer() {
  return (
    <footer className="bg-midnight pb-10 pt-[90px]">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
        <div className="mb-20 grid grid-cols-1 gap-[60px] sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <span className="mb-[18px] block font-display text-xl font-semibold tracking-[0.5px] text-parchment">
              Sleepifyme
            </span>
            <p className="max-w-[280px] text-sm leading-[1.75] text-parchment/[0.55]">
              Products, services, and experiences, curated to help you sleep
              better, night after night.
            </p>
          </div>

          <div>
            <h4 className="mb-[22px] text-[11.5px] uppercase tracking-[2px] text-goldSoft">
              Shop
            </h4>
            <ul className="list-none">
              {shopLinks.map((label) => (
                <li key={label} className="mb-[13px]">
                  <a
                    href="#"
                    className="text-sm text-parchment/[0.68] transition-colors duration-200 hover:text-goldSoft"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-[22px] text-[11.5px] uppercase tracking-[2px] text-goldSoft">
              Company
            </h4>
            <ul className="list-none">
              {companyLinks.map((label) => (
                <li key={label} className="mb-[13px]">
                  <a
                    href="#"
                    className="text-sm text-parchment/[0.68] transition-colors duration-200 hover:text-goldSoft"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-[22px] text-[11.5px] uppercase tracking-[2px] text-goldSoft">
              Join the List
            </h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full border-0 border-b border-gold/[0.28] bg-transparent py-2.5 text-sm text-parchment placeholder:text-parchment/40 focus:border-gold focus:outline-none"
              />
            </form>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold/[0.28] pt-[34px] text-[12.5px] tracking-[0.3px] text-parchment/40">
          <span>&copy; 2026 Sleepifyme. All rights reserved.</span>
          <span>Jaipur, Rajasthan</span>
        </div>
      </div>
    </footer>
  );
}
