const details = [
  {
    number: "01",
    title: "Even, Calming Weight",
    description:
      "The 5kg weighted blanket distributes deep, even pressure across your body, the same principle behind a calming hug, engineered to quiet a racing mind and ease you into rest.",
  },
  {
    number: "02",
    title: "Cooler By Three Degrees",
    description:
      "Breathable bamboo sheets wick heat and moisture through the night, keeping your sleep surface measurably cooler than standard cotton, so you stay comfortable instead of overheated.",
  },
  {
    number: "03",
    title: "Support That Holds All Night",
    description:
      "Contour memory foam pillows hold their shape through every position change, cradling your neck and shoulders so you wake without the stiffness of a pillow that gave out at 2am.",
  },
  {
    number: "04",
    title: "Complete, Gentle Darkness",
    description:
      "The mulberry silk eye mask blocks light fully without pressing on your eyes, soft enough to forget you're wearing it, dark enough to signal your body it's really time to rest.",
  },
];

export default function ProductDetailGrid() {
  return (
    <section className="bg-ink py-28">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
        <div className="mx-auto mb-20 max-w-[640px] text-center">
          <div className="mb-[18px] text-xs uppercase tracking-[3px] text-goldSoft">
            What&rsquo;s Inside
          </div>
          <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-medium text-parchment">
            Considered, Piece by Piece
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-16 gap-y-14 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.number}>
              <span className="mb-3 block font-display text-[42px] italic leading-none text-goldDeep/70">
                {item.number}
              </span>
              <h3 className="mb-3 font-display text-xl font-medium text-parchment">
                {item.title}
              </h3>
              <p className="max-w-[420px] text-[14.5px] leading-[1.8] text-parchment/[0.65]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
