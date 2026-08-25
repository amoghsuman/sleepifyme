type FaqItem = {
  question: string;
  answer: string;
};

function buildFaqs(whatsInsideAnswer: string): FaqItem[] {
  return [
    {
      question: "What exactly is in the box?",
      answer: whatsInsideAnswer,
    },
    {
      question: "How does the 30-night guarantee work?",
      answer:
        "Sleep on it for up to 30 nights. If it hasn't genuinely improved your sleep, contact us for a full refund, no questions asked. We'll arrange the return and process your refund once the items are back with us.",
    },
    {
      question: "How do I care for the weighted blanket?",
      answer:
        "Spot clean where possible. For a full wash, use a front-loading machine on a cold, gentle cycle and air dry flat, the weight distributes unevenly in a dryer. Avoid dry cleaning solvents, which can degrade the fill over time.",
    },
    {
      question: "Is cash on delivery available?",
      answer:
        "Yes, COD is available at checkout for most pin codes across India, alongside standard prepaid options.",
    },
  ];
}

export default function ProductFAQ({
  whatsInsideAnswer,
}: {
  whatsInsideAnswer: string;
}) {
  const faqs = buildFaqs(whatsInsideAnswer);

  return (
    <section className="bg-midnight py-28">
      <div className="mx-auto max-w-[720px] px-6 sm:px-10">
        <div className="mb-16 text-center">
          <div className="mb-[18px] text-xs uppercase tracking-[3px] text-goldSoft">
            Good to Know
          </div>
          <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-medium text-parchment">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="border-t border-gold/[0.15]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-gold/[0.15] py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-medium text-parchment [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="shrink-0 text-2xl font-normal text-gold transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[600px] text-[14.5px] leading-[1.8] text-parchment/[0.65]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
