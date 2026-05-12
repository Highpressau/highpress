import Link from "next/link";
import { client } from "@/sanity/lib/client";

const query = `
*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt
}
`;

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const search = searchParams?.q?.toLowerCase() || "";

  const posts = await client.fetch(query);

  const filteredPosts = posts.filter((post: any) =>
    post.title?.toLowerCase().includes(search)
  );

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
            defaultValue={search}
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

        <div className="mt-12 space-y-4">
          {search && filteredPosts.length === 0 && (
            <div className="border border-black p-8">
              <h2 className="text-2xl font-black uppercase">
                No stories found
              </h2>

              <p className="mt-3 text-black/60">
                Try searching for another club, player, league or topic.
              </p>
            </div>
          )}

          {search &&
            filteredPosts.map((post: any) => (
              <Link
                key={post._id}
                href={`/posts/${post.slug.current}`}
                className="block border border-black p-6 transition hover:bg-black hover:text-white"
              >
                <h2 className="text-2xl font-black uppercase tracking-[-0.04em]">
                  {post.title}
                </h2>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}