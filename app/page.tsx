export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt?: string;
  _createdAt?: string;
  categories?: { title: string; slug?: { current: string } }[];
};

type SiteSettings = {
  heroPost?: Post;
  heroSize?: "standard" | "large" | "xl";
  latestTitle?: string;
  featuresTitle?: string;
  featuresEyebrow?: string;
  featuredPosts?: Post[];
  socialEyebrow?: string;
  socialTitle?: string;
  socialCardLabel?: string;
  socialCardTitle?: string;
  socialCardDescription?: string;
};

const postsQuery = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc)[0...12] {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  _createdAt,
  categories[]->{title, slug}
}`;

const settingsQuery = `*[_type == "siteSettings"][0]{
  heroPost->{
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    _createdAt,
    categories[]->{title,slug}
  },
  heroSize,
  latestTitle,
  featuresTitle,
  featuresEyebrow,
  featuredPosts[]->{
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    _createdAt,
    categories[]->{title,slug}
  },
  socialEyebrow,
  socialTitle,
  socialCardLabel,
  socialCardTitle,
  socialCardDescription
}`;

function getCategory(post: Post) {
  return post.categories?.[0]?.title || "Story";
}

function getTimeAgo(post: Post) {
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

function isFeature(post: Post) {
  return post.categories?.some((category) =>
    ["feature", "features", "interview", "interviews"].includes(
      category.title.toLowerCase()
    )
  );
}

function ArticleImage({
  post,
  className,
  priority = false,
}: {
  post: Post;
  className?: string;
  priority?: boolean;
}) {
  if (!post.mainImage) {
    return (
      <div
        className={`flex items-center justify-center bg-black text-xs font-black uppercase tracking-[0.22em] text-white ${className}`}
      >
        Highpress
      </div>
    );
  }

  return (
    <Image
      src={urlFor(post.mainImage).width(1400).height(900).url()}
      alt={post.title}
      width={1400}
      height={900}
      priority={priority}
      className={`object-cover transition duration-500 group-hover:scale-105 ${className}`}
    />
  );
}

function ArticleCard({ post, dark = false }: { post: Post; dark?: boolean }) {
  const timeAgo = getTimeAgo(post);

  return (
    <Link href={`/posts/${post.slug.current}`} className="group block h-full">
      <article
        className={`flex h-full flex-col transition duration-300 ${
          dark
            ? "border border-white/25 p-3 hover:border-white"
            : "border border-transparent p-3 hover:border-black hover:bg-black hover:text-white"
        }`}
      >
        <div className="overflow-hidden border border-black bg-white">
          <ArticleImage post={post} className="aspect-[4/3] w-full" />
        </div>

        <div className="mt-4">
          <p
            className={`mb-1 text-[11px] font-black uppercase tracking-[0.22em] transition ${
              dark
                ? "text-white/50 group-hover:text-white"
                : "text-black/50 group-hover:text-white/60"
            }`}
          >
            {getCategory(post)}
          </p>

          {timeAgo && (
            <p
              className={`mb-2 text-[10px] font-black uppercase tracking-[0.2em] transition ${
                dark
                  ? "text-white/35 group-hover:text-white/60"
                  : "text-black/35 group-hover:text-white/50"
              }`}
            >
              {timeAgo}
            </p>
          )}

          <h3
            className={`text-xl font-black uppercase leading-[0.96] tracking-[-0.045em] transition md:text-2xl ${
              dark ? "text-white" : ""
            }`}
          >
            {post.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}

export default async function HomePage() {
  const [posts, settings]: [Post[], SiteSettings | null] = await Promise.all([
    client.fetch(postsQuery),
    client.fetch(settingsQuery),
  ]);

  const hero = settings?.heroPost || posts[0];

  const latest = posts
    .filter((post) => post._id !== hero?._id)
    .slice(0, 4);

  return (
    <main className="bg-[#f2f2ee] text-black">
      {hero && (
        <section className="px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <Link href={`/posts/${hero.slug.current}`} className="group block">
              <article className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div className="max-w-2xl">
                  <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-black/50">
                    {getCategory(hero)}
                  </p>

                  <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] md:text-6xl lg:text-7xl">
                    {hero.title}
                  </h1>

                  {hero.excerpt && (
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-black/70 md:text-lg">
                      {hero.excerpt}
                    </p>
                  )}

                  <div className="mt-7 inline-flex border border-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] transition group-hover:bg-black group-hover:text-white">
                    Read Story
                  </div>
                </div>

                <div className="overflow-hidden border border-black bg-white shadow-[8px_8px_0_#000]">
                  <ArticleImage
                    post={hero}
                    priority
                    className="aspect-[16/10] w-full"
                  />
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      <section className="border-t border-black px-4 py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between border-b border-black pb-4">
            <h2 className="text-4xl font-black uppercase tracking-[-0.05em] md:text-6xl">
              {settings?.latestTitle || "Latest"}
            </h2>

            <Link
              href="/news"
              className="text-[11px] font-black uppercase tracking-[0.18em] underline underline-offset-4 transition hover:opacity-50"
            >
              View All
            </Link>
          </div>

          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
            {latest.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black px-4 py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 border-b border-black pb-4">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.25em] text-black/50">
              {settings?.socialEyebrow || "From the scene"}
            </p>

            <h2 className="text-4xl font-black uppercase tracking-[-0.05em] md:text-6xl">
              {settings?.socialTitle || "The Social Wire"}
            </h2>
          </div>

          <div className="max-w-xl">
            <a
              href="https://www.instagram.com/nplaustralia/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="border border-black bg-white p-5 shadow-[6px_6px_0_#000] transition duration-300 hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-[8px_8px_0_#000]">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/50 transition group-hover:text-white/50">
                  {settings?.socialCardLabel || "Instagram"}
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase leading-none tracking-[-0.04em]">
                  {settings?.socialCardTitle || "National Premier Leagues"}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-black/60 transition group-hover:text-white/70">
                  {settings?.socialCardDescription ||
                    "Latest moments, matchday posts and stories from around the NPL."}
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}