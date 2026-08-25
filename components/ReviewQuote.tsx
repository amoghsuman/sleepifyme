export default function ReviewQuote({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.06),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-[1240px] px-6 sm:px-10">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-6 flex justify-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
              </svg>
            ))}
          </div>
          <p className="font-display text-[clamp(22px,2.8vw,32px)] font-normal italic leading-[1.5] text-parchment">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-8 text-[12.5px] uppercase tracking-[2px] text-goldSoft">
            &mdash; {author}
          </div>
        </div>
      </div>
    </section>
  );
}
