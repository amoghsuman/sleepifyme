import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JournalCategoryPills from "@/components/JournalCategoryPills";
import ArticleCard, { FeaturedArticleCard } from "@/components/ArticleCard";
import { getBlogArticles } from "@/lib/shopify";
import { journalCategories, getJournalCategory } from "@/lib/journal";

export const metadata: Metadata = {
  title: "The Journal",
  description:
    "Notes on rest — practical sleep tips, product guides, and stories from Sleepifyme, for how you actually sleep.",
};

export default async function JournalPage(props: PageProps<"/journal">) {
  const searchParams = await props.searchParams;
  const rawCategory = searchParams.category;
  const categoryHandle =
    typeof rawCategory === "string" ? rawCategory : journalCategories[0].handle;
  const category = getJournalCategory(categoryHandle) ?? journalCategories[0];

  const articles = await getBlogArticles(category.handle);
  const [featured, ...rest] = articles;

  return (
    <>
      <Nav />

      <section className="relative flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#0A1128_0%,#070C1F_55%,#05070F_100%)] px-6 pb-24 pt-[200px] text-center">
        <div>
          <div className="mb-6 text-xs uppercase tracking-[4px] text-goldSoft">
            The Journal
          </div>
          <h1 className="font-display text-[clamp(42px,6.4vw,84px)] font-medium leading-[1.08] tracking-[-0.01em] text-parchment">
            Notes on rest
          </h1>
        </div>
      </section>

      <section className="bg-midnight pb-32">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
          <div className="mb-16 flex justify-center">
            <JournalCategoryPills active={category.handle} />
          </div>

          {articles.length === 0 ? (
            <div className="mx-auto max-w-[560px] py-16 text-center">
              <span className="mb-6 block font-display text-[13px] italic tracking-[1px] text-goldSoft">
                Coming Soon
              </span>
              <h2 className="mb-6 font-display text-[clamp(28px,3.4vw,38px)] font-medium text-parchment">
                {category.title}
              </h2>
              <p className="text-[15.5px] leading-[1.85] text-parchment/[0.68]">
                We&rsquo;re still writing here. New {category.title.toLowerCase()}{" "}
                stories are on their way.
              </p>
              <div className="mx-auto mt-10 h-px w-16 bg-gold/[0.28]" />
            </div>
          ) : (
            <>
              {featured && <FeaturedArticleCard article={featured} />}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
