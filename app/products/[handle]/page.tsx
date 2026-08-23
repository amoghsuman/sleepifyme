import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import {
  formatPrice,
  getAllProductHandles,
  getProductByHandle,
} from "@/lib/shopify";

export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  return handles.map((handle) => ({ handle }));
}

export default async function ProductPage(
  props: PageProps<"/products/[handle]">
) {
  const { handle } = await props.params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const variant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-midnight pt-[86px]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-16 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:gap-24 lg:py-28">
          <div className="flex aspect-[4/5] items-center justify-center border border-gold/[0.15] bg-[linear-gradient(155deg,#101a3a_0%,#0A1128_55%,#070B1E_100%)]">
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
          </div>

          <div>
            <h1 className="font-display text-[clamp(30px,3.6vw,44px)] font-medium leading-[1.15] text-parchment">
              {product.title}
            </h1>

            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-2xl text-goldSoft">
                {formatPrice(product.price.amount)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-parchment/40 line-through">
                  {formatPrice(product.compareAtPrice.amount)}
                </span>
              )}
            </div>

            <p className="mt-8 max-w-[480px] text-[15.5px] leading-[1.85] text-parchment/[0.72]">
              {product.description}
            </p>

            <div className="mt-10">
              {variant ? (
                <AddToCartButton
                  variantId={variant.id}
                  disabled={!variant.availableForSale}
                />
              ) : (
                <p className="text-sm text-parchment/50">
                  Currently unavailable.
                </p>
              )}
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-gold/[0.15] pt-8 text-[12px] uppercase tracking-[1px] text-goldSoft">
              <li>30-Night Guarantee</li>
              <li>Free Shipping</li>
              <li>COD Available</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
