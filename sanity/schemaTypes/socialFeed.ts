import {defineField, defineType} from 'sanity'

export const socialFeedType = defineType({
  name: 'socialFeed',
  title: 'Social Feed',
  type: 'document',

  fields: [
    defineField({
      name: 'league',
      title: 'League / Source',
      type: 'string',
      options: {
        list: [
          {title: 'National Premier Leagues', value: 'National Premier Leagues'},
          {title: 'NPL VIC', value: 'NPL VIC'},
          {title: 'NPL NSW', value: 'NPL NSW'},
          {title: 'NPL QLD', value: 'NPL QLD'},
          {title: 'NPL SA', value: 'NPL SA'},
          {title: 'NPL WA', value: 'NPL WA'},
          {title: 'Other', value: 'Other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Card Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'instagramUrl',
      title: 'Instagram Post URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
})