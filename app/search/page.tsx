import Link from "next/link";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#f2f2ee] px-6 py-20 text-black md:px-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-black/45">
          Archive
        </p>

        <h1 className="text-5xl font-black uppercase tracking-[-0.06em]">
          Search HIGHPRESS
        </h1>

        <form action="/search" className="mt-10 flex gap-3">
          <input
            type="search"
            name="q"
            placeholder="Search clubs, players, leagues..."
            className="w-full border border-black bg-transparent px-4 py-4 text-sm font-bold uppercase tracking-[0.14em] outline-none"
          />

          <button
            type="submit"
            className="border border-black bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-transparent hover:text-black"
          >
            Search
          </button>
        </form>

        <div className="mt-12 border border-black p-8">
          <h2 className="text-2xl font-black uppercase tracking-[-0.04em]">
            Search coming soon
          </h2>

          <p className="mt-3 text-black/60">
            HIGHPRESS archive search is currently being built.
          </p>

          <Link
            href="/news"
            className="mt-6 inline-block border border-black px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
          >
            Back to news
          </Link>
        </div>
      </div>
    </main>
  );
}