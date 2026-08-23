import Link from "next/link";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

export default function ProductCard({ product }: { product: ShopifyProduct }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="block border border-gold/[0.15] bg-midnight px-8 py-14 text-center transition-colors duration-[400ms] hover:bg-[#0d1638]"
    >
      <div className="mx-auto mb-7 h-20 w-20">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="h-full w-full stroke-gold opacity-85"
          strokeWidth={0.8}
        >
          <path d="M20 58 Q50 38 80 58 L80 74 Q50 90 20 74 Z" />
          <path d="M20 58 Q50 74 80 58" />
          <path d="M28 64 Q50 76 72 64" opacity={0.6} />
        </svg>
      </div>
      <h3 className="mb-2 font-display text-xl font-medium text-parchment">
        {product.title}
      </h3>
      <p className="text-[13px] tracking-[0.5px] text-goldSoft">
        {formatPrice(product.price.amount)}
      </p>
    </Link>
  );
}
