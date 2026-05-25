import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: '',
        }),

        defineField({
          name: 'credit',
          title: 'Image Credit',
          type: 'string',
          initialValue: '',
        }),

        defineField({
          name: 'sourceUrl',
          title: 'Image Source URL',
          type: 'url',
          initialValue: '',
        }),
      ],
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      initialValue: '',
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      initialValue: '',
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',

      components: {
        input: (props) => (
          <div
            style={{
              fontSize: '21px',
              lineHeight: '1.9',
              minHeight: '800px',
              padding: '12px 0',
            }}
          >
            {props.renderDefault(props)}
          </div>
        ),
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },

    prepare(selection) {
      const {author} = selection

      return {
        ...selection,
        subtitle: author && `by ${author}`,
      }
    },
  },
})