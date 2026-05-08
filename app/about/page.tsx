export default function AboutPage() {
  return (
    <main className="bg-[#f2f2ee] text-black">
      {/* HEADER */}
      <section className="border-b border-black/10 px-8 py-12 md:px-16">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">
            About
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <section className="flex justify-center px-8 py-16 md:px-16">
        <div className="w-full max-w-2xl">
          <p className="mb-10 text-xl font-medium leading-[1.6] md:text-2xl">
            HIGHPRESS is the home of Australian state league football.
          </p>

          <p className="mb-10 text-lg leading-[1.75] text-black/75">
            We cover the National Premier Leagues — the players, the clubs, the
            culture and the communities that define the game beyond the top tier.
          </p>

          <p className="mb-10 text-lg leading-[1.75] text-black/75">
            This isn’t a federation website. It isn’t just scores and fixtures.
          </p>

          <p className="mb-10 text-lg leading-[1.75] text-black/75">
            Highpress exists to cover the layers of the game that often go
            unseen — the moments, the people and the narratives that define
            football outside the spotlight.
          </p>

          <p className="mb-10 text-lg leading-[1.75] text-black/75">
            Across every state, every round and every ground, we focus on what
            matters: the football, the culture, and the community around it.
          </p>

          <p className="mb-16 text-lg leading-[1.75] text-black/75">
            Because the story of the game isn’t only played at the top.
          </p>

          <p className="text-2xl font-black uppercase leading-tight tracking-[-0.04em] md:text-3xl">
            Australian state league football, told properly.
          </p>

          <div className="mt-14 border-t border-black/15 pt-8">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-black/45">
              Contact
            </p>

            <p className="text-base leading-relaxed text-black/70 md:text-lg">
              For editorial, media and collaboration enquiries:{" "}
              <a
                href="mailto:highpressau@outlook.com"
                className="font-bold text-black underline underline-offset-4 transition hover:opacity-60"
              >
                highpressau@outlook.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}