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
              name: 'sourceRole',
              title: 'Source role',
              type: 'string',
              options: {
                list: [
                  {title: 'Binding rule', value: 'binding-rule'},
                  {title: 'Agency clarification', value: 'agency-clarification'},
                  {title: 'Currentness record', value: 'currentness-record'},
                ],
              },
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
    defineField({
      name: 'supportingPassages',
      title: 'Supporting passages',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'supportingPassage',
          type: 'object',
          fields: [
            defineField({name: 'sourceTitle', title: 'Source title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'sourceUrl', title: 'Source URL', type: 'url', validation: (Rule) => Rule.required()}),
            defineField({name: 'sourceCitation', title: 'Source citation', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'sourceVersion', title: 'Source version', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'citation', title: 'Passage citation', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'text', title: 'Exact supporting passage', type: 'text', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'requires',
              title: 'Required related sources',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'requiredSource',
                  type: 'object',
                  fields: [
                    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
                    defineField({name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required()}),
                    defineField({name: 'citation', title: 'Citation', type: 'string', validation: (Rule) => Rule.required()}),
                  ],
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'claimType',
              title: 'Claim type',
              type: 'string',
              options: {
                list: [
                  {title: 'Disposal', value: 'disposal'},
                  {title: 'Currentness', value: 'currentness'},
                  {title: 'Agency logistics', value: 'agency-logistics'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})
