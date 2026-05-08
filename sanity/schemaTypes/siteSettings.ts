import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',

  fields: [
    defineField({
      name: 'heroPost',
      title: 'Homepage Hero Article',
      type: 'reference',
      to: [{ type: 'post' }],
    }),

    defineField({
      name: 'heroSize',
      title: 'Homepage Hero Size',
      type: 'string',
      initialValue: 'standard',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'Large', value: 'large' },
          { title: 'Extra Large', value: 'xl' },
        ],
      },
    }),

    defineField({
      name: 'latestTitle',
      title: 'Latest Section Title',
      type: 'string',
      initialValue: 'Latest',
    }),

    defineField({
      name: 'featuresTitle',
      title: 'Features Section Title',
      type: 'string',
      initialValue: 'Features',
    }),

    defineField({
      name: 'featuresEyebrow',
      title: 'Features Small Text',
      type: 'string',
      initialValue: 'Football + Culture + Community',
    }),

    defineField({
      name: 'featuredPosts',
      title: 'Featured Articles',
      description: 'Choose up to 3 articles to appear in the homepage Features section.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: 'socialEyebrow',
      title: 'Social Wire Small Text',
      type: 'string',
      initialValue: 'From the scene',
    }),

    defineField({
      name: 'socialTitle',
      title: 'Social Wire Title',
      type: 'string',
      initialValue: 'The Social Wire',
    }),

    defineField({
      name: 'socialCardLabel',
      title: 'Social Card Label',
      type: 'string',
      initialValue: 'Instagram',
    }),

    defineField({
      name: 'socialCardTitle',
      title: 'Social Card Title',
      type: 'string',
      initialValue: 'National Premier Leagues',
    }),

    defineField({
      name: 'socialCardDescription',
      title: 'Social Card Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Latest moments, matchday posts and stories from around the NPL.',
    }),
  ],
})