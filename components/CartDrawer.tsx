"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/shopify";

function LineArtThumb() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="h-full w-full stroke-gold opacity-85"
      strokeWidth={1.2}
    >
      <path d="M20 58 Q50 38 80 58 L80 74 Q50 90 20 74 Z" />
      <path d="M20 58 Q50 74 80 58" />
      <path d="M28 64 Q50 76 72 64" opacity={0.6} />
    </svg>
  );
}

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isOpen,
    isLoading,
    closeCart,
    updateItem,
    removeItem,
    cart,
  } = useCart();

  return (
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-[300] bg-ink/60 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-[301] flex w-full max-w-[420px] flex-col bg-parchment text-midnight shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-midnight/10 px-8 py-7">
          <h2 className="font-display text-xl font-medium">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-2xl leading-none text-midnight/60 transition-colors hover:text-midnight"
          >
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-display text-lg text-midnight/70">
              Your cart is empty
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="text-[13px] uppercase tracking-[1.4px] text-goldDeep underline underline-offset-4"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <ul className="space-y-6">
                {items.map((line) => (
                  <li key={line.id} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 border border-midnight/10 bg-midnight p-3">
                      {line.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={line.image.url}
                          alt={line.image.altText ?? line.productTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <LineArtThumb />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${line.productHandle}`}
                          onClick={closeCart}
                          className="font-display text-[15px] leading-tight transition-colors hover:text-goldDeep"
                        >
                          {line.productTitle}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          disabled={isLoading}
                          aria-label="Remove item"
                          className="text-midnight/40 transition-colors hover:text-midnight disabled:opacity-40"
                        >
                          &times;
                        </button>
                      </div>

                      {line.variantTitle !== "Default Title" && (
                        <span className="mt-1 text-xs text-midnight/50">
                          {line.variantTitle}
                        </span>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-midnight/15">
                          <button
                            type="button"
                            onClick={() => updateItem(line.id, line.quantity - 1)}
                            disabled={isLoading}
                            aria-label="Decrease quantity"
                            className="px-3 py-1 text-sm text-midnight/70 transition-colors hover:text-midnight disabled:opacity-40"
                          >
                            &minus;
                          </button>
                          <span className="min-w-[2ch] text-center text-sm">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItem(line.id, line.quantity + 1)}
                            disabled={isLoading}
                            aria-label="Increase quantity"
                            className="px-3 py-1 text-sm text-midnight/70 transition-colors hover:text-midnight disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm text-goldDeep">
                          {formatPrice(line.lineTotal.amount)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-midnight/10 px-8 py-7">
              <div className="mb-5 flex items-center justify-between text-sm">
                <span className="uppercase tracking-[1.4px] text-midnight/60">
                  Subtotal
                </span>
                <span className="font-display text-lg text-midnight">
                  {formatPrice(subtotal.amount)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (cart) window.location.href = cart.checkoutUrl;
                }}
                disabled={!cart || isLoading}
                className="block w-full rounded-[2px] bg-gold py-4 text-center text-[13px] font-bold uppercase tracking-[1.6px] text-ink transition-all duration-300 hover:-translate-y-px hover:bg-goldSoft disabled:cursor-not-allowed disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
