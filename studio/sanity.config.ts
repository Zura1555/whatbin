import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SourceResearchTool} from './sourceResearchTool'

export default defineConfig({
  name: 'default',
  title: 'WhatBin',

  projectId: 'xqeddep2',
  dataset: 'production',

  auth: {loginMethod: 'token'},

  plugins: [structureTool(), visionTool()],
  tools: (prev) => [...prev, {name: 'source-research', title: 'Source research', component: SourceResearchTool}],

  schema: {
    types: schemaTypes,
  },
})
