import assert from 'node:assert/strict'
import test from 'node:test'
import { researchSource } from './source-research.mjs'

const input = { canonicalItemId: 'old-mattress', jurisdiction: 'hanoi' }
const references = [
  { title: 'Decision A', url: 'https://vbpl.vn/decision-a', citation: 'Article 1', sourceRole: 'binding-rule' },
  { title: 'Decision B', url: 'https://vbpl.vn/decision-b', citation: 'Article 2', sourceRole: 'currentness-record' },
]
const candidate = {
  status: 'PREVIEW', canonicalItemId: 'old-mattress', itemName: 'Old mattress', jurisdiction: 'hanoi',
  disposalCategory: 'collection', instruction: 'Use municipal collection.', validFrom: '2026-01-01', validUntil: null,
  sourceReferences: references,
  supportingPassages: references.map((reference, index) => ({
    sourceTitle: reference.title, sourceUrl: reference.url, sourceCitation: reference.citation,
    sourceVersion: 'Current version', citation: `Article ${index + 1}`, text: `Verified passage ${index}`,
    requires: [{title: references[1 - index].title, url: references[1 - index].url, citation: references[1 - index].citation}],
    claimType: index ? 'currentness' : 'disposal',
  })),
}

function providerResponse(value, urls = references.map(({ url }) => url)) {
  const text = JSON.stringify(value)
  return new Response(JSON.stringify({ steps: [{
    type: 'model_output', content: [{ type: 'text', text, annotations: urls.map((url) => ({
      type: 'url_citation', url, start_index: 0, end_index: text.length,
    })) }],
  }] }), { status: 200 })
}

test('research uses Interactions search tools and returns only officially grounded previews', async () => {
  const originalKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  let request
  try {
    const result = await researchSource(input, { fetchImpl: async (url, init) => {
      request = { url, ...init, body: JSON.parse(init.body) }
      return providerResponse(candidate)
    } })
    assert.equal(request.url, 'https://generativelanguage.googleapis.com/v1beta/interactions')
    assert.equal(request.body.model, 'gemini-3.8-flash')
    assert.deepEqual(request.body.tools, [{ type: 'google_search' }, { type: 'url_context' }])
    assert.deepEqual(result, candidate)
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalKey
  }
})

test('research preserves PREVIEW when official citation offsets include Vietnamese text', async () => {
  const originalKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  try {
    const result = await researchSource(input, { fetchImpl: async () => {
      const instruction = 'Đưa nệm cũ đến điểm thu gom.'
      const text = JSON.stringify({ ...candidate, instruction })
      const start_index = text.indexOf(instruction)
      return new Response(JSON.stringify({ steps: [{
        type: 'model_output', content: [{ type: 'text', text, annotations: references.map(({ url }) => ({
          type: 'url_citation', url, start_index, end_index: start_index + instruction.length,
        })) }],
      }] }), { status: 200 })
    } })
    assert.equal(result.status, 'PREVIEW')
    assert.equal(result.instruction, 'Đưa nệm cũ đến điểm thu gom.')
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalKey
  }
})

test('research returns GAP when an agency clarification is labeled as disposal evidence', async () => {
  const originalKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  try {
    const invalid = structuredClone(candidate)
    const agencyReference = {
      title: 'Agency guidance', url: 'https://vbpl.vn/agency-guidance', citation: 'Section 1',
      sourceRole: 'agency-clarification',
    }
    invalid.sourceReferences.push(agencyReference)
    invalid.supportingPassages.push({
      sourceTitle: agencyReference.title, sourceUrl: agencyReference.url, sourceCitation: agencyReference.citation,
      sourceVersion: 'Current version', citation: 'Section 1', text: 'Agency logistics guidance.',
      requires: [references[0]], claimType: 'disposal',
    })
    const urls = [...references.map(({ url }) => url), agencyReference.url]
    const result = await researchSource(input, { fetchImpl: async () => providerResponse(invalid, urls) })
    assert.equal(result.status, 'GAP')
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalKey
  }
})

test('research returns GAP when a supporting passage has no required source', async () => {
  const originalKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  try {
    const invalid = structuredClone(candidate)
    invalid.supportingPassages[0].requires = []
    const result = await researchSource(input, { fetchImpl: async () => providerResponse(invalid) })
    assert.equal(result.status, 'GAP')
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalKey
  }
})

test('research returns GAP when candidate sources lack official URL-citation annotations', async () => {
  const originalKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  try {
    const result = await researchSource(input, { fetchImpl: async () => providerResponse(candidate, ['https://example.com/not-official']) })
    assert.equal(result.status, 'GAP')
    assert.equal(Object.hasOwn(result, 'candidate'), false)
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalKey
  }
})

test('research preserves an explicit provider GAP without candidate data', async () => {
  const originalKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  try {
    const result = await researchSource(input, { fetchImpl: async () => providerResponse({ status: 'GAP', reason: 'Sources conflict.' }) })
    assert.deepEqual(result, { status: 'GAP', reason: 'Sources conflict.' })
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalKey
  }
})
