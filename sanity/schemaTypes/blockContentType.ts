import {defineArrayMember, defineField, defineType} from 'sanity'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',

  of: [
    defineArrayMember({
      type: 'block',

      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],

      lists: [{title: 'Bullet', value: 'bullet'}],

      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],

        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      name: 'image',
      title: 'Inline Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
        defineField({
          name: 'credit',
          title: 'Image Credit',
          type: 'string',
        }),
        defineField({
          name: 'sourceUrl',
          title: 'Image Source URL',
          type: 'url',
        }),
      ],
    }),

    defineArrayMember({
      name: 'socialEmbed',
      title: 'Social Embed',
      type: 'object',

      fields: [
        {
          name: 'platform',
          title: 'Platform',
          type: 'string',
          options: {
            list: [
              {title: 'X / Twitter', value: 'twitter'},
              {title: 'Instagram', value: 'instagram'},
              {title: 'YouTube', value: 'youtube'},
              {title: 'TikTok', value: 'tiktok'},
            ],
          },
        },

        {
          name: 'url',
          title: 'Post URL',
          type: 'url',
        },
      ],

      preview: {
        select: {
          title: 'platform',
          subtitle: 'url',
        },
      },
    }),
  ],
})