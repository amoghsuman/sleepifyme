import Link from "next/link";
import { journalCategories, type JournalCategoryHandle } from "@/lib/journal";

export default function JournalCategoryPills({
  active,
}: {
  active: JournalCategoryHandle;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {journalCategories.map((category) => {
        const isActive = category.handle === active;
        return (
          <Link
            key={category.handle}
            href={`/journal?category=${category.handle}`}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-5 py-2 text-[11.5px] uppercase tracking-[1.4px] transition-colors duration-300 ${
              isActive
                ? "border-gold bg-gold text-ink"
                : "border-gold/[0.28] text-goldSoft hover:border-gold hover:text-gold"
            }`}
          >
            {category.title}
          </Link>
        );
      })}
    </div>
  );
}
