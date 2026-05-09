export const dynamic = "force-dynamic";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

const FEATURES_QUERY = `*[_type == "post" && "Features" in categories[]->title] | order(coalesce(publishedAt, _createdAt) desc){
  _id,
  title,
  slug,
  excerpt,
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

function FeatureCard({ post }: { post: any }) {
  const timeAgo = getTimeAgo(post);

  return (
    <a
      href={`/posts/${post.slug.current}`}
      className="group block h-full transition duration-300"
    >
      <div className="overflow-hidden bg-white">
        {post.mainImage ? (
          <img
            src={urlFor(post.mainImage).width(900).height(650).url()}
            alt={post.title}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-white text-xs font-black uppercase tracking-[0.22em] text-black">
            Highpress
          </div>
        )}
      </div>

      <div className="pt-4 transition duration-300 group-hover:bg-white group-hover:px-3 group-hover:pb-3 group-hover:text-black">
        <p className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-white/50 transition group-hover:text-black/50">
          Features
        </p>

        {timeAgo && (
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/35 transition group-hover:text-black/40">
            {timeAgo}
          </p>
        )}

        <h2 className="text-xl font-black uppercase leading-[0.96] tracking-[-0.045em] md:text-2xl">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/60 transition group-hover:text-black/70">
            {post.excerpt}
          </p>
        )}
      </div>
    </a>
  );
}

export default async function FeaturesPage() {
  const posts = await client.fetch(FEATURES_QUERY);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/20 px-8 py-12 md:px-16">
        <h1 className="text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">
          Features
        </h1>
      </section>

      <section className="px-8 py-14 md:px-16">
        {posts.length === 0 ? (
          <p className="text-white/60">
            No features published yet. Add the “Features” category to articles
            in Sanity.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post: any) => (
              <FeatureCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}