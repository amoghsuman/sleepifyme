"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/shopify";

function PlaceholderArt() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="h-2/5 w-2/5 stroke-gold opacity-90"
      strokeWidth={0.6}
    >
      <path d="M20 58 Q50 38 80 58 L80 74 Q50 90 20 74 Z" />
      <path d="M20 58 Q50 74 80 58" />
      <path d="M28 64 Q50 76 72 64" opacity={0.6} />
    </svg>
  );
}

export default function ProductGallery({
  images,
  productTitle,
}: {
  images: ProductImage[];
  productTitle: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center border border-gold/[0.15] bg-[linear-gradient(155deg,#101a3a_0%,#0A1128_55%,#070B1E_100%)]">
        <PlaceholderArt />
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden border border-gold/[0.15] bg-midnight">
        <Image
          src={activeImage.url}
          alt={activeImage.altText ?? productTitle}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex}
              className={`relative aspect-square overflow-hidden border transition-colors duration-300 ${
                index === activeIndex
                  ? "border-gold"
                  : "border-gold/[0.15] opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${productTitle} thumbnail ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
