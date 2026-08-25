"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AUTH_COOKIES } from "@/lib/authCookies";

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Must default to false/null on the server (no `document`) and only
    // read the real cookies after mount, same reasoning as the nav's own
    // login-state check: reading them any earlier would make the client's
    // first render diverge from the SSR output whenever a session actually
    // exists, causing a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!readCookie(AUTH_COOKIES.loggedInFlag));
    setFirstName(readCookie(AUTH_COOKIES.firstName));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isLoggedIn ? "Your account" : "Sign in"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current stroke-[1.4]">
          <path d="M20 21a8 8 0 10-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-20 z-[110] rounded-[2px] border border-midnight/10 bg-parchment p-6 text-ink shadow-xl min-[900px]:absolute min-[900px]:inset-x-auto min-[900px]:left-auto min-[900px]:right-0 min-[900px]:top-[calc(100%+16px)] min-[900px]:w-[280px]">
          {isLoggedIn ? (
            <>
              <p className="mb-5 font-display text-lg font-medium text-midnight">
                Welcome back{firstName ? `, ${firstName}` : ""}
              </p>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="mb-4 block text-[12.5px] uppercase tracking-[1.4px] text-goldDeep transition-colors hover:text-midnight"
              >
                My Account
              </Link>
              <a
                href="/api/auth/logout"
                className="inline-block border-b border-goldDeep/40 pb-1 text-[12px] uppercase tracking-[1.6px] text-goldDeep transition-colors hover:border-goldDeep hover:text-midnight"
              >
                Sign Out
              </a>
            </>
          ) : (
            <>
              <p className="mb-2 font-display text-lg font-medium text-midnight">
                Sign in to Sleepifyme
              </p>
              <p className="mb-5 text-[13px] leading-[1.65] text-taupe">
                Sign in or create an account to view your orders.
              </p>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-[2px] bg-gold py-3 text-center text-[12px] font-bold uppercase tracking-[1.6px] text-ink transition-colors duration-300 hover:bg-goldSoft"
              >
                Continue
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
