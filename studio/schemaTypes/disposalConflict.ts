import {defineArrayMember, defineField, defineType} from 'sanity'

export const disposalConflict = defineType({
  name: 'disposalConflict',
  title: 'Disposal conflict',
  type: 'document',
  fields: [
    defineField({
      name: 'canonicalItemId',
      title: 'Canonical item ID',
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
      name: 'validFrom',
      title: 'Conflict applies from',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validUntil',
      title: 'Conflict applies until (exclusive)',
      type: 'date',
    }),
    defineField({
      name: 'summary',
      title: 'What remains unresolved',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'claims',
      title: 'Conflicting source claims',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'sourceClaim',
          type: 'object',
          fields: [
            defineField({name: 'sourceTitle', title: 'Source title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'sourceUrl', title: 'Official URL', type: 'url', validation: (Rule) => Rule.required()}),
            defineField({name: 'sourceVersion', title: 'Source version/status', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'citation', title: 'Article or clause', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'claim', title: 'Claim as stated by source (not WhatBin advice)', type: 'text', validation: (Rule) => Rule.required()}),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
})
