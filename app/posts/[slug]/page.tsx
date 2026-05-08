import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import SocialEmbed from "@/components/SocialEmbed";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  mainImage,
  body,
  publishedAt,
  author->{name},
  categories[]->{title}
}`;

const RELATED_QUERY = `*[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  categories[]->{title}
}`;

const components = {
  types: {
    socialEmbed: ({ value }: any) => (
      <div className="my-14 flex justify-center">
        <SocialEmbed platform={value.platform} url={value.url} />
      </div>
    ),

    image: ({ value }: any) => {
      const credit = value?.credit;
      const sourceUrl = value?.sourceUrl;
      const alt = value?.alt || "Article image";

      return (
        <figure className="my-14">
          <img
            src={urlFor(value).width(1200).url()}
            alt={alt}
            className="w-full border border-black object-cover"
          />

          {credit && (
            <figcaption className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black/45">
              Photo:{" "}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black"
                >
                  {credit}
                </a>
              ) : (
                credit
              )}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    normal: ({ children }: any) => (
      <p className="mb-7 text-[18px] leading-[1.78] text-black/80">
        {children}
      </p>
    ),

    h2: ({ children }: any) => (
      <h2 className="mb-6 mt-16 text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-black md:text-4xl">
        {children}
      </h2>
    ),

    h3: ({ children }: any) => (
      <h3 className="mb-5 mt-12 text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-black">
        {children}
      </h3>
    ),

    blockquote: ({ children }: any) => (
      <blockquote className="my-16 border-y border-black py-8">
        <p className="mx-auto max-w-2xl text-center text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-black md:text-4xl">
          “{children}”
        </p>
      </blockquote>
    ),
  },
};

function RelatedCard({ post }: { post: any }) {
  const category = post.categories?.[0]?.title || "Story";

  return (
    <a
      href={`/posts/${post.slug.current}`}
      className="group block border border-transparent p-3 transition hover:border-black hover:bg-black hover:text-white"
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
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-black/50 transition group-hover:text-white/60">
          {category}
        </p>

        <h3 className="text-xl font-black uppercase leading-[0.96] tracking-[-0.045em] md:text-2xl">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-black/60 transition group-hover:text-white/70">
            {post.excerpt}
          </p>
        )}
      </div>
    </a>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, relatedPosts] = await Promise.all([
    client.fetch(POST_QUERY, { slug }),
    client.fetch(RELATED_QUERY, { slug }),
  ]);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#f2f2ee] px-8 py-16 text-black md:px-16">
        <h1 className="text-4xl font-black uppercase">Post not found</h1>
      </main>
    );
  }

  const category = post.categories?.[0]?.title || "Article";
  const author = post.author?.name || "HIGHPRESS";
  const imageCredit = post.mainImage?.credit;
  const imageSourceUrl = post.mainImage?.sourceUrl;
  const imageAlt = post.mainImage?.alt || post.title;

  return (
    <main className="min-h-screen bg-[#f2f2ee] text-black">
      <article>
        <header className="border-b border-black/10 px-6 py-14 md:px-16 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.28em] text-black/50">
              {category}
            </p>

            <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] md:text-6xl lg:text-7xl">
              {post.title}
            </h1>

            <div className="mt-7 flex flex-wrap gap-4 border-t border-black/10 pt-5 text-sm text-black/50">
              <span>By {author}</span>

              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </header>

        {post.mainImage && (
          <section className="px-6 py-10 md:px-16">
            <figure className="mx-auto max-w-5xl">
              <img
                src={urlFor(post.mainImage).width(1600).url()}
                alt={imageAlt}
                className="w-full border border-black object-cover shadow-[8px_8px_0_#000]"
              />

              {imageCredit && (
                <figcaption className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black/45">
                  Photo:{" "}
                  {imageSourceUrl ? (
                    <a
                      href={imageSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-black"
                    >
                      {imageCredit}
                    </a>
                  ) : (
                    imageCredit
                  )}
                </figcaption>
              )}
            </figure>
          </section>
        )}

        <section className="flex justify-center px-6 pb-20 md:px-16">
          <div className="w-full max-w-2xl">
            <PortableText value={post.body} components={components} />

            <footer className="mt-16 border-t border-black pt-8">
              <div className="flex flex-wrap gap-4">
                <a
                  href="/"
                  className="border border-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
                >
                  ← Back Home
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
                >
                  Share →
                </a>
              </div>
            </footer>
          </div>
        </section>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-black px-6 py-14 md:px-16 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 border-b border-black pb-4">
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.25em] text-black/50">
                Keep Reading
              </p>

              <h2 className="text-4xl font-black uppercase tracking-[-0.05em] md:text-6xl">
                Related Stories
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost: any) => (
                <RelatedCard key={relatedPost._id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}