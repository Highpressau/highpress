export default function ArticlePage() {
  return (
    <main>
      <article className="px-8 md:px-16 py-16 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-5">
          Features
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-black mb-6">
          The clubs, crowds and characters driving state league football.
        </h1>

        <p className="text-gray-500 mb-10">By HIGHPRESS • April 2026</p>

        <div className="aspect-[16/9] bg-black/5 mb-10"></div>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            State league football is where the game feels closest to its people.
            The grounds are familiar, the voices are local and the stories are
            built week by week.
          </p>

          <p>
            Across Australia, clubs carry histories shaped by migration,
            suburbs, volunteers, juniors, rivalries and families who have stood
            on the same terraces for generations.
          </p>

          <blockquote className="border-l-4 border-black pl-5 text-2xl font-bold text-black">
            This is football with memory, texture and meaning.
          </blockquote>

          <p>
            HIGHPRESS exists to bring those stories forward — not as background
            noise, but as the heartbeat of Australian football.
          </p>
        </div>
      </article>
    </main>
  );
}