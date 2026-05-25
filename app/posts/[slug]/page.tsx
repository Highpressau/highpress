import {PortableText} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

type Props = {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      publishedAt,
      body,
      mainImage,
      "author": author->name,
      "categories": categories[]->title,
      seoTitle,
      seoDescription,
      slug
    }
    `,
    {slug}
  )
}

export default async function PostPage({params}: Props) {
  const post = await getPost(params.slug)

  if (!post) {
    return (
      <main className="bg-[#f2f2ee] text-black min-h-screen px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-sm mb-4">
            Post not found
          </p>

          <Link
            href="/news"
            className="underline underline-offset-4 uppercase text-sm tracking-[0.2em]"
          >
            Back to news
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#f2f2ee] text-black min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link
            href="/news"
            className="text-xs uppercase tracking-[0.25em] hover:opacity-70 transition"
          >
            Back to News
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.2em] border-b border-black pb-4 mb-8">
          {post.author && <span>{post.author}</span>}

          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        {post.mainImage && (
          <div className="relative aspect-[16/9] w-full mb-10 overflow-hidden">
            <Image
              src={urlFor(post.mainImage).width(1600).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.body && (
          <div className="prose prose-lg max-w-none prose-headings:uppercase prose-headings:font-black prose-p:text-[1.15rem] prose-p:leading-relaxed">
            <PortableText value={post.body} />
          </div>
        )}
      </article>
    </main>
  )
}