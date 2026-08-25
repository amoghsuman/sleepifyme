import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import ProductDetailGrid from "@/components/ProductDetailGrid";
import ProductFAQ from "@/components/ProductFAQ";
import ReviewQuote from "@/components/ReviewQuote";
import {
  formatPrice,
  getAllProductHandles,
  getProductByHandle,
} from "@/lib/shopify";

export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata(
  props: PageProps<"/products/[handle]">
): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProductByHandle(handle);

  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
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
          <ProductGallery images={product.images} productTitle={product.title} />

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

      <ProductDetailGrid />
      <ProductFAQ whatsInsideAnswer={product.description} />
      <ReviewQuote
        quote="The first product that actually changed how I sleep, not just another blanket in a box."
        author="Verified Buyer"
      />

      <Footer />
    </>
  );
}
