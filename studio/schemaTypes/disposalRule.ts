import {defineArrayMember, defineField, defineType} from 'sanity'

export const disposalRule = defineType({
  name: 'disposalRule',
  title: 'Disposal rule',
  type: 'document',
  fields: [
    defineField({
      name: 'canonicalItemId',
      title: 'Canonical item ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'itemName',
      title: 'Item',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'jurisdiction',
      title: 'Jurisdiction',
      type: 'string',
      options: {
        list: [
          {title: 'Hanoi', value: 'hanoi'},
          {title: 'Ho Chi Minh City', value: 'ho-chi-minh-city'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'disposalCategory',
      title: 'Disposal category',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instruction',
      title: 'User instruction',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid from',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid until (exclusive)',
      type: 'date',
    }),
    defineField({
      name: 'sourceReferences',
      title: 'Source references',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'sourceReference',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Source title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Official URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'citation',
              title: 'Article or clause',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sourceNote',
              title: 'What this source supports',
              type: 'text',
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
