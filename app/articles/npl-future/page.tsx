export default function ArticlePage() {
  return (
    <main>
      <article className="px-8 md:px-16 py-16 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-5">
          Features
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-black mb-6">
          Why the NPL is producing the next generation of Australian football.
        </h1>

        <p className="text-gray-500 mb-10">
          By HIGHPRESS • April 2026
        </p>

        <div className="aspect-[16/9] bg-black/5 mb-10"></div>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            Across Australia, state league football continues to sit at the heart
            of the game’s culture, development and community identity.
          </p>

          <p>
            From packed suburban grounds to ambitious clubs with professional
            standards, the NPL has become one of the most important spaces in
            Australian football.
          </p>

          <blockquote className="border-l-4 border-black pl-5 text-2xl font-bold text-black">
            The future of Australian football is not only built in academies. It
            is built on terraces, under lights and in local communities.
          </blockquote>

          <p>
            HIGHPRESS exists to tell those stories properly — with depth,
            urgency and respect for the people who make the game what it is.
          </p>
        </div>
      </article>
    </main>
  );
}