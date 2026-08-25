"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { formatPrice, searchProducts, type ShopifyProduct } from "@/lib/shopify";

const DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;

function ResultThumbnail({ product }: { product: ShopifyProduct }) {
  if (product.featuredImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.featuredImage.url}
        alt={product.featuredImage.altText ?? product.title}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="h-full w-full stroke-gold p-2 opacity-85"
      strokeWidth={0.8}
    >
      <path d="M20 58 Q50 38 80 58 L80 74 Q50 90 20 74 Z" />
      <path d="M20 58 Q50 74 80 58" />
      <path d="M28 64 Q50 76 72 64" opacity={0.6} />
    </svg>
  );
}

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const trimmedQuery = query.trim();
  const isQueryTooShort = trimmedQuery.length < MIN_QUERY_LENGTH;

  useEffect(() => {
    // Nothing to search yet - the render logic below already treats a
    // too-short query as "show nothing," so there's no need to reset
    // results/hasSearched here too (avoids stale-result flicker either way).
    if (isQueryTooShort) return;

    // Standard "set loading before an effect-triggered fetch" pattern: the
    // fetch itself has to be kicked off from an effect since it depends on
    // the debounced query, so this synchronous setState is the intended one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      searchProducts(trimmedQuery)
        .then((products) => setResults(products))
        .catch(() => setResults([]))
        .finally(() => {
          setIsLoading(false);
          setHasSearched(true);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [trimmedQuery, isQueryTooShort]);

  function handleSubmit(event: FormEvent) {
    // The debounced effect above already covers typing; this just stops a
    // literal form submission (Enter key) from reloading the page.
    event.preventDefault();
  }

  function closeAndReset() {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close search" : "Search"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current stroke-[1.4]">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-20 z-[110] max-h-[70vh] overflow-y-auto rounded-[2px] border border-midnight/10 bg-parchment p-6 text-ink shadow-xl min-[900px]:absolute min-[900px]:inset-x-auto min-[900px]:left-auto min-[900px]:right-0 min-[900px]:top-[calc(100%+16px)] min-[900px]:w-[360px]">
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full border-0 border-b border-midnight/20 bg-transparent pb-3 text-[15px] text-midnight placeholder:text-taupe focus:border-gold focus:outline-none"
            />
          </form>

          <div className="mt-5">
            {!isQueryTooShort && isLoading && (
              <p className="text-[13px] text-taupe">Searching…</p>
            )}

            {!isQueryTooShort && !isLoading && hasSearched && results.length === 0 && (
              <p className="text-[13px] text-taupe">No results found.</p>
            )}

            {!isQueryTooShort && !isLoading && results.length > 0 && (
              <ul className="space-y-4">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.handle}`}
                      onClick={closeAndReset}
                      className="group flex items-center gap-4"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden border border-midnight/10 bg-midnight">
                        <ResultThumbnail product={product} />
                      </div>
                      <div>
                        <p className="font-display text-[15px] font-medium text-midnight transition-colors group-hover:text-goldDeep">
                          {product.title}
                        </p>
                        <p className="mt-1 text-[13px] text-goldDeep">
                          {formatPrice(product.price.amount)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
