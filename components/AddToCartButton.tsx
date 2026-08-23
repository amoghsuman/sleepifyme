"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  variantId,
  disabled = false,
}: {
  variantId: string;
  disabled?: boolean;
}) {
  const { addItem, isLoading } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = async () => {
    try {
      await addItem(variantId);
      setJustAdded(true);
      timeoutRef.current = setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const label = justAdded ? "Added" : isLoading ? "Adding..." : "Add to Cart";

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      onClick={handleClick}
      className="inline-block rounded-[2px] bg-gold px-9 py-4 text-[13px] font-bold uppercase tracking-[1.6px] text-ink transition-all duration-300 hover:-translate-y-px hover:bg-goldSoft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
    >
      {disabled ? "Sold Out" : label}
    </button>
  );
}
