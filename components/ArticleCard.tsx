import Link from "next/link";
import { formatArticleDate, type ShopifyArticle } from "@/lib/shopify";

function JournalIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="h-full w-full stroke-gold opacity-85"
      strokeWidth={0.8}
    >
      <path d="M20 25 Q50 15 80 25 V78 Q50 68 20 78 Z" />
      <path d="M50 22 V75" />
      <path d="M28 38 H42 M28 48 H42 M58 38 H72 M58 48 H72" opacity={0.6} />
    </svg>
  );
}

export default function ArticleCard({ article }: { article: ShopifyArticle }) {
  return (
    <Link
      href={`/journal/${article.blogHandle}/${article.handle}`}
      className="group block border border-gold/[0.15] bg-midnight px-8 py-10 transition-colors duration-[400ms] hover:bg-[#0d1638]"
    >
      <div className="mb-6 h-14 w-14">
        <JournalIcon />
      </div>
      <span className="mb-3 block text-[11px] uppercase tracking-[1.6px] text-goldSoft">
        {formatArticleDate(article.publishedAt)}
      </span>
      <h3 className="mb-3 font-display text-xl font-medium leading-snug text-parchment transition-colors group-hover:text-goldSoft">
        {article.title}
      </h3>
      <p className="text-[13.5px] leading-[1.7] text-parchment/[0.6]">
        {article.excerpt}
      </p>
    </Link>
  );
}

export function FeaturedArticleCard({ article }: { article: ShopifyArticle }) {
  return (
    <Link
      href={`/journal/${article.blogHandle}/${article.handle}`}
      className="group mb-16 grid grid-cols-1 gap-10 border border-gold/[0.15] bg-midnight p-10 transition-colors duration-[400ms] hover:bg-[#0d1638] md:grid-cols-2 md:gap-16 md:p-14"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(155deg,#101a3a_0%,#0A1128_55%,#070B1E_100%)]">
        <div className="h-24 w-24">
          <JournalIcon />
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <span className="mb-4 text-xs uppercase tracking-[3px] text-goldSoft">
          Latest &middot; {formatArticleDate(article.publishedAt)}
        </span>
        <h2 className="mb-5 font-display text-[clamp(26px,3vw,38px)] font-medium leading-[1.2] text-parchment transition-colors group-hover:text-goldSoft">
          {article.title}
        </h2>
        <p className="mb-6 max-w-[480px] text-[15px] leading-[1.8] text-parchment/[0.65]">
          {article.excerpt}
        </p>
        <span className="self-start border-b border-gold/[0.28] pb-[3px] text-[13px] uppercase tracking-[1.4px] text-gold">
          Read Article
        </span>
      </div>
    </Link>
  );
}
