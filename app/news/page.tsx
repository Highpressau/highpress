export const dynamic = "force-dynamic";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

const NEWS_QUERY = `*[_type == "post" && "News" in categories[]->title] | order(coalesce(publishedAt, _createdAt) desc){
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  _createdAt,
  categories[]->{title}
}`;

function getTimeAgo(post: any) {
  const dateValue = post.publishedAt || post._createdAt;

  if (!dateValue) return null;

  const now = new Date();
  const past = new Date(dateValue);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Just now";

  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} min${mins > 1 ? "s" : ""} ago`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(diff / 86400);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function NewsCard({ post }: { post: any }) {
  const timeAgo = getTimeAgo(post);

  return (
    <a
      href={`/posts/${post.slug.current}`}
      className="group block h-full border border-transparent p-3 transition duration-300 hover:border-black hover:bg-black hover:text-white"
    >
      <div className="overflow-hidden border border-black bg-white">
        {post.mainImage ? (
          <img
            src={urlFor(post.mainImage).width(900).height(650).url()}
            alt={post.title}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-black text-xs font-black uppercase tracking-[0.22em] text-white">
            Highpress
          </div>
        )}
      </div>

      <div className="pt-4">
        <p className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-black/50 transition group-hover:text-white/60">
          News
        </p>

        {timeAgo && (
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/35 transition group-hover:text-white/50">
            {timeAgo}
          </p>
        )}

        <h2 className="text-2xl font-black uppercase leading-[0.96] tracking-[-0.045em]">
          {post.title}
        </h2>
      </div>
    </a>
  );
}

export default async function NewsPage() {
  const posts = await client.fetch(NEWS_QUERY);

  return (
    <main className="min-h-screen bg-[#f2f2ee] text-black">
      <section className="border-b border-black/10 px-8 py-10 md:px-16">
        <h1 className="text-4xl font-black uppercase leading-tight tracking-[-0.045em] md:text-5xl">
          News
        </h1>
      </section>

      <section className="px-8 py-14 md:px-16">
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post: any) => (
            <NewsCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}