import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { formatArticleDate, getArticleByHandle, getBlogArticles } from "@/lib/shopify";

export async function generateStaticParams() {
  const articles = await getBlogArticles("sleep-tips");
  return articles.map((article) => ({
    blog: article.blogHandle,
    article: article.handle,
  }));
}

export async function generateMetadata(
  props: PageProps<"/journal/[blog]/[article]">
): Promise<Metadata> {
  const { blog, article: articleHandle } = await props.params;
  const article = await getArticleByHandle(blog, articleHandle);

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.image ? [{ url: article.image.url }] : undefined,
    },
  };
}

export default async function ArticlePage(
  props: PageProps<"/journal/[blog]/[article]">
) {
  const { blog, article: articleHandle } = await props.params;
  const article = await getArticleByHandle(blog, articleHandle);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Nav />

      <header className="bg-midnight px-6 pb-16 pt-[160px] sm:px-10">
        <div className="mx-auto max-w-[720px]">
          <Link
            href={`/journal?category=${article.blogHandle}`}
            className="mb-10 inline-block text-[12px] uppercase tracking-[1.6px] text-goldSoft transition-colors hover:text-gold"
          >
            &larr; Back to Journal
          </Link>
          <div className="mb-4 text-xs uppercase tracking-[2px] text-goldSoft">
            {article.blogTitle} &middot; {formatArticleDate(article.publishedAt)}
          </div>
          <h1 className="font-display text-[clamp(30px,4vw,48px)] font-medium leading-[1.15] text-parchment">
            {article.title}
          </h1>
        </div>
      </header>

      <main className="bg-parchment px-6 py-20 sm:px-10">
        <article
          className="prose prose-lg mx-auto max-w-[680px]"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </main>

      <Footer />
    </>
  );
}
