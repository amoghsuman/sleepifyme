import Link from "next/link";
import { personas, type Persona } from "@/lib/personas";

export default function PersonaTabs({ active }: { active: Persona }) {
  return (
    <nav className="border-b border-gold/[0.28]">
      <ul className="mx-auto flex max-w-[1240px] flex-wrap justify-center gap-10 px-6 sm:px-10">
        {personas.map((persona) => {
          const isActive = persona.slug === active;
          return (
            <li key={persona.slug}>
              <Link
                href={`/collections/${persona.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`inline-block border-b py-6 text-[12.5px] uppercase tracking-[1.8px] transition-colors duration-300 ${
                  isActive
                    ? "border-gold text-gold"
                    : "border-transparent text-goldSoft hover:text-gold"
                }`}
              >
                {persona.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
