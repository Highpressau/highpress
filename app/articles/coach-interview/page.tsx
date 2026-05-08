export default function ArticlePage() {
  return (
    <main>
      <article className="px-8 md:px-16 py-16 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-5">
          Interviews
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-black mb-6">
          Inside the dressing room with one of the NPL’s rising coaches.
        </h1>

        <p className="text-gray-500 mb-10">By HIGHPRESS • April 2026</p>

        <div className="aspect-[16/9] bg-black/5 mb-10"></div>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            In the NPL, coaching is about more than tactics. It is about
            standards, relationships, belief and building a culture that lasts
            beyond one result.
          </p>

          <p>
            For emerging coaches across Australia, the competition is becoming
            a proving ground where ideas are tested every weekend under real
            pressure.
          </p>

          <blockquote className="border-l-4 border-black pl-5 text-2xl font-bold text-black">
            “You learn quickly at this level. Every detail matters.”
          </blockquote>

          <p>
            From the training pitch to the dressing room, HIGHPRESS goes inside
            the environments shaping the next generation of Australian football
            leaders.
          </p>
        </div>
      </article>
    </main>
  );
}