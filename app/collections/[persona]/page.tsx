import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PersonaTabs from "@/components/PersonaTabs";
import ProductCard from "@/components/ProductCard";
import { getProductsByTag } from "@/lib/shopify";
import { getPersona, personas } from "@/lib/personas";

export const dynamicParams = false;

export function generateStaticParams() {
  return personas.map((persona) => ({ persona: persona.slug }));
}

export async function generateMetadata(
  props: PageProps<"/collections/[persona]">
): Promise<Metadata> {
  const { persona: personaSlug } = await props.params;
  const persona = getPersona(personaSlug);

  if (!persona) return {};

  return {
    title: `Shop ${persona.title}`,
    description: persona.description,
    openGraph: {
      title: `Shop ${persona.title}`,
      description: persona.description,
    },
  };
}

export default async function CollectionPage(
  props: PageProps<"/collections/[persona]">
) {
  const { persona: personaSlug } = await props.params;
  const persona = getPersona(personaSlug);

  if (!persona) {
    notFound();
  }

  const products = await getProductsByTag(persona.slug);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-midnight pt-[86px]">
        <PersonaTabs active={persona.slug} />

        <section className="mx-auto max-w-[1240px] px-6 py-24 sm:px-10">
          {products.length > 0 ? (
            <>
              <div className="mx-auto mb-16 max-w-[640px] text-center">
                <div className="mb-[18px] text-xs uppercase tracking-[3px] text-goldSoft">
                  Shop {persona.title}
                </div>
                <h1 className="font-display text-[clamp(30px,3.6vw,44px)] font-medium text-parchment">
                  {persona.title}
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-[560px] py-24 text-center">
              <span className="mb-6 block font-display text-[13px] italic tracking-[1px] text-goldSoft">
                Coming Soon
              </span>
              <h1 className="mb-6 font-display text-[clamp(30px,3.6vw,44px)] font-medium text-parchment">
                {persona.title}
              </h1>
              <p className="text-[15.5px] leading-[1.85] text-parchment/[0.68]">
                {persona.description}
              </p>
              <div className="mx-auto mt-10 h-px w-16 bg-gold/[0.28]" />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
