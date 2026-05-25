import {Metadata} from 'next'
import {notFound} from 'next/navigation'
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

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found | HIGHPRESS',
    }
  }

  const title = post.seoTitle || post.title
  const description =
    post.seoDescription ||
    'Australian state league football coverage from HIGHPRESS.'

  const url = `https://www.highpressau.com/posts/${post.slug.current}`

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: 'HIGHPRESS',
      type: 'article',
      images: post.mainImage
        ? [
            {
              url: urlFor(post.mainImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.mainImage
        ? [urlFor(post.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export default async function PostPage({params}: Props) {
  const post = await getPost(params.slug)

  // IMPORTANT: Real 404 handling
  if (!post) {
    notFound()
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

        <div className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] border-b border-black pb-4 mb-8">
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

        <div className="prose prose-lg max-w-none prose-headings:uppercase prose-headings:font-black prose-p:text-[1.15rem] prose-p:leading-relaxed">
          <PortableText value={post.body} />
        </div>
      </article>
    </main>
  )
}