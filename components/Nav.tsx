"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Shop", href: "#personas" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-[background-color,padding,border-color] duration-500 ease-in-out ${
        scrolled
          ? "border-gold/[0.28] bg-midnight/[0.86] py-4 backdrop-blur-[14px]"
          : "border-transparent py-[26px]"
      }`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="font-display text-[22px] font-semibold tracking-[0.5px] text-parchment"
        >
          Sleepifyme
        </Link>

        <ul className="hidden gap-11 min-[900px]:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group relative pb-1 text-[12.5px] uppercase tracking-[1.8px] text-goldSoft"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-[22px] text-goldSoft">
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current stroke-[1.4]">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current stroke-[1.4]">
            <path d="M20 21a8 8 0 10-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative"
          >
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current stroke-[1.4]">
              <path d="M3 6h18M6 6l1 14h10l1-14M9 6V4a3 3 0 016 0v2" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-ink">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative h-[17px] w-[17px] min-[900px]:hidden"
          >
            <span
              className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? "top-1/2 rotate-45" : "top-[4px] rotate-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-full bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? "top-1/2 -rotate-45" : "top-[13px] rotate-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden bg-midnight/[0.96] backdrop-blur-[14px] transition-[max-height,opacity] duration-300 ease-in-out min-[900px]:hidden ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 border-t border-gold/[0.15] px-6 py-4 sm:px-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[13px] uppercase tracking-[1.8px] text-goldSoft"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
