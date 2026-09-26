import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer, matchSupportingPassages, selectActiveConflicts, selectActiveRule } from './application.mjs'

test('selectActiveRule applies exclusive effective dates and fails closed', () => {
  const rule = { id: 'rule-1', validFrom: '2026-09-01', validUntil: '2026-09-24' }

  assert.deepEqual(selectActiveRule([rule], '2026-09-01'), { status: 'MATCHED', rule })
  assert.deepEqual(selectActiveRule([rule], '2026-09-24'), { status: 'UNKNOWN' })
  assert.deepEqual(selectActiveRule([], '2026-09-10'), { status: 'UNKNOWN' })

  const overlapping = { id: 'rule-2', validFrom: '2026-09-10', validUntil: null }
  const conflict = selectActiveRule([rule, overlapping], '2026-09-10')
  assert.deepEqual(conflict, { status: 'CONFLICT' })
  assert.equal(Object.hasOwn(conflict, 'rule'), false)

  assert.throws(() => selectActiveRule([{ validFrom: '2026-02-30', validUntil: null }], '2026-09-10'),
    /invalid effective dates/)
  assert.throws(() => selectActiveRule([{ validFrom: '2026-09-20', validUntil: '2026-09-19' }], '2026-09-10'),
    /invalid effective dates/)
})

test('selectActiveConflicts applies exclusive dates and requires cited competing claims', () => {
  const conflict = {
    validFrom: '2020-01-01',
    validUntil: '2020-01-11',
    summary: 'Official sources disagree.',
    claims: [
      {sourceTitle: 'Notice A', sourceUrl: 'https://official.example/a', sourceVersion: '2020 edition', citation: 'Article 2', claim: 'Claim A.'},
      {sourceTitle: 'Notice B', sourceUrl: 'https://official.example/b', sourceVersion: '2020 edition', citation: 'Article 3', claim: 'Claim B.'},
    ],
  }
  const selected = selectActiveConflicts([conflict], '2020-01-10')
  assert.equal(selected.status, 'CONFLICT')
  assert.equal(selected.conflicts[0].claims.length, 2)
  assert.equal(Object.hasOwn(selected, 'instruction'), false)
  assert.equal(selectActiveConflicts([conflict], '2020-01-11'), null)
  assert.throws(() => selectActiveConflicts([{...conflict, validUntil: '2019-12-31'}], '2020-01-10'), /invalid effective dates/)
  assert.throws(() => selectActiveConflicts([{...conflict, claims: []}], '2020-01-10'), /invalid content/)
})

test('supporting passages require the exact cited source and version', () => {
  const source = { title: 'Decision 36/2024/QĐ-UBND', url: 'https://official.example/decision-36', citation: 'Articles 5(2) and 5(3)' }
  const version = { title: 'Decision 2736/QĐ-UBND', url: 'https://official.example/decision-2736', citation: 'Article 1' }
  const passage = {
    sourceTitle: source.title,
    sourceUrl: source.url,
    sourceCitation: source.citation,
    requires: [version],
    sourceVersion: 'Decision 36, retained after Decision 2736',
    citation: 'Article 5(2)',
    text: 'Exact source text.',
    claimType: 'disposal',
  }

  assert.deepEqual(matchSupportingPassages([source, version], [passage]), [{
    sourceTitle: source.title, sourceUrl: source.url, sourceCitation: source.citation,
    sourceVersion: passage.sourceVersion, citation: passage.citation, text: passage.text,
    requires: [version], claimType: 'disposal',
  }])
  assert.deepEqual(matchSupportingPassages([{ ...source, citation: 'Article 5(2)' }, version], [passage]), [])
  assert.deepEqual(matchSupportingPassages([source], [passage]), [])
  assert.deepEqual(matchSupportingPassages([source, version], []), [])
})

test('static server serves the public app and blocks path traversal', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))

  try {
    const { port } = server.address()
    const origin = `http://127.0.0.1:${port}`
    const home = await fetch(`${origin}/`)
    assert.equal(home.status, 200)
    assert.match(await home.text(), /<title>WhatBin — Check where it goes<\/title>/)

    for (const asset of ['/app.js', '/styles.css']) {
      const response = await fetch(`${origin}${asset}`)
      assert.equal(response.status, 200, `${asset} should be served`)
    }

    const traversal = await fetch(`${origin}/%2e%2e%2fserver.mjs`)
    assert.equal(traversal.status, 403)
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})

test('recognize accepts exact phone, battery, and power-bank pairs without conflating items', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))

  const originalFetch = globalThis.fetch
  const originalApiKey = process.env.GEMINI_API_KEY
  const batteryCandidate = {
    supported: true, confidence: 0.8,
    canonicalItemId: 'used-lithium-ion-battery', itemName: 'Used rechargeable lithium-ion battery',
  }
  const powerBankCandidate = {
    supported: true, confidence: 0.8,
    canonicalItemId: 'used-power-bank', itemName: 'Used power bank',
  }
  const phoneCandidate = {
    supported: true, confidence: 0.8,
    canonicalItemId: 'used-mobile-phone', itemName: 'Used mobile phone',
  }
  let mockedCandidate = batteryCandidate
  let description = 'discarded rechargeable lithium-ion battery pack'
  let prompt
  process.env.GEMINI_API_KEY = 'test-key'
  globalThis.fetch = async (input, init) => {
    if (String(input).includes('generativelanguage.googleapis.com')) {
      prompt = JSON.parse(init.body).contents[0].parts[0].text
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify(mockedCandidate) }] } }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return originalFetch(input, init)
  }

  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const recognize = async () => {
      const response = await fetch(`${origin}/api/recognize`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      assert.equal(response.status, 200)
      return response.json()
    }

    assert.deepEqual((await recognize()).candidate, {
      canonicalItemId: batteryCandidate.canonicalItemId, itemName: batteryCandidate.itemName,
    })
    assert.match(prompt, /"used-lithium-ion-battery".*"Used rechargeable lithium-ion battery".*cell or battery pack/)
    assert.match(prompt, /"used-power-bank".*"Used power bank".*as a whole item/)
    assert.match(prompt, /not installed in a device.*batteries still installed in devices, whole devices including power banks, other battery chemistries, chargers, or uncertain items/)
    assert.match(prompt, /never identify a whole power bank as a standalone battery/)
    assert.match(prompt, /"used-mobile-phone".*"Used mobile phone".*discarded whole mobile phone as one household electronic item/)
    assert.match(prompt, /phone accessories, standalone batteries, batteries installed in a device as separate items, or complete power banks/)

    assert.match(prompt, /"used-household-battery".*"Used household battery".*AA or AAA/)

    description = 'discarded whole mobile phone'
    mockedCandidate = phoneCandidate
    assert.deepEqual((await recognize()).candidate, {
      canonicalItemId: phoneCandidate.canonicalItemId, itemName: phoneCandidate.itemName,
    })
    mockedCandidate = { ...phoneCandidate, itemName: 'Used power bank' }
    assert.equal((await recognize()).candidate, null)
    mockedCandidate = { ...phoneCandidate, canonicalItemId: 'used-power-bank' }
    assert.equal((await recognize()).candidate, null)

    description = 'discarded portable power bank'
    mockedCandidate = powerBankCandidate
    assert.deepEqual((await recognize()).candidate, {
      canonicalItemId: powerBankCandidate.canonicalItemId, itemName: powerBankCandidate.itemName,
    })
    mockedCandidate = { ...batteryCandidate, itemName: 'Used household battery' }
    assert.equal((await recognize()).candidate, null)
    mockedCandidate = { ...batteryCandidate, canonicalItemId: 'used-household-battery' }
    assert.equal((await recognize()).candidate, null)
    mockedCandidate = { ...batteryCandidate, itemName: 'Used power bank' }
    assert.equal((await recognize()).candidate, null)
    mockedCandidate = { ...powerBankCandidate, canonicalItemId: 'used-lithium-ion-battery' }
    assert.equal((await recognize()).candidate, null)
  } finally {
    globalThis.fetch = originalFetch
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})
test('research-source enforces Studio origin and bearer authorization', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const originalFetch = globalThis.fetch
  const originalOrigins = process.env.SANITY_STUDIO_ORIGINS
  const originalApiKey = process.env.GEMINI_API_KEY
  process.env.SANITY_STUDIO_ORIGINS = 'https://studio.example, http://localhost:3333'
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  let accesses = 0
  globalThis.fetch = async (input, init) => {
    if (String(input).startsWith('http://127.0.0.1:')) return originalFetch(input, init)
    if (String(input).includes('/access/project/')) { accesses++; return new Response('{}', { status: 200 }) }
    return new Response(JSON.stringify({ result: [] }), { status: 200 })
  }
  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const options = await fetch(`${origin}/api/research-source`, {
      method: 'OPTIONS', headers: { origin: 'https://studio.example', 'access-control-request-method': 'POST' },
    })
    assert.equal(options.status, 204)
    assert.equal(options.headers.get('access-control-allow-origin'), 'https://studio.example')
    assert.equal(options.headers.get('access-control-allow-methods'), 'POST, OPTIONS')
    assert.equal(accesses, 0)

    const deniedOrigin = await fetch(`${origin}/api/research-source`, {
      method: 'POST', headers: { origin: 'https://evil.example', authorization: 'Bearer hidden' },
      body: JSON.stringify({ canonicalItemId: 'old-mattress', jurisdiction: 'hanoi' }),
    })
    assert.equal(deniedOrigin.status, 403)
    const noToken = await fetch(`${origin}/api/research-source`, {
      method: 'POST', headers: { origin: 'https://studio.example' },
      body: JSON.stringify({ canonicalItemId: 'old-mattress', jurisdiction: 'hanoi' }),
    })
    assert.equal(noToken.status, 401)
    assert.equal(accesses, 0)
  } finally {
    globalThis.fetch = originalFetch
    if (originalOrigins === undefined) delete process.env.SANITY_STUDIO_ORIGINS
    else process.env.SANITY_STUDIO_ORIGINS = originalOrigins
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})
test('research-source rejects HCMC phone requests and previews Hanoi phones only', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const originalFetch = globalThis.fetch
  const originalOrigins = process.env.SANITY_STUDIO_ORIGINS
  const originalApiKey = process.env.GEMINI_API_KEY
  process.env.SANITY_STUDIO_ORIGINS = 'https://studio.example'
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  const refs = [
    { title: 'Decision A', url: 'https://vbpl.vn/decision-a', citation: 'Article 5(1)(h)', sourceRole: 'binding-rule' },
    { title: 'Decision B', url: 'https://vbpl.vn/decision-b', citation: 'Legal status', sourceRole: 'currentness-record' },
  ]
  let providerCalls = 0
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.startsWith('http://127.0.0.1:')) return originalFetch(input, init)
    if (url.includes('/access/project/')) return new Response('{}', { status: 200 })
    if (url.includes('/data/query/')) return new Response(JSON.stringify({ result: [] }), { status: 200 })
    providerCalls++
    const candidate = {
      status: 'PREVIEW', canonicalItemId: 'used-mobile-phone', itemName: 'Used mobile phone', jurisdiction: 'hanoi',
      disposalCategory: 'reuse-recycling', instruction: 'Transfer the discarded phone through the locally directed collection route.',
      validFrom: '2026-01-08', validUntil: null, sourceReferences: refs,
      supportingPassages: refs.map((ref, index) => ({
        sourceTitle: ref.title, sourceUrl: ref.url, sourceCitation: ref.citation, sourceVersion: 'Current version',
        citation: ref.citation, text: `Verified passage ${index}`, requires: [refs[1 - index]],
        claimType: index ? 'currentness' : 'disposal',
      })),
    }
    const text = JSON.stringify(candidate)
    return new Response(JSON.stringify({ steps: [{
      type: 'model_output', content: [{ type: 'text', text, annotations: refs.map((ref) => ({
        type: 'url_citation', url: ref.url, start_index: 0, end_index: text.length,
      })) }],
    }] }), { status: 200 })
  }
  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const research = async (jurisdiction) => {
      const response = await fetch(`${origin}/api/research-source`, {
        method: 'POST',
        headers: { origin: 'https://studio.example', authorization: 'Bearer isolated-token', 'content-type': 'application/json' },
        body: JSON.stringify({ canonicalItemId: 'used-mobile-phone', jurisdiction }),
      })
      return { status: response.status, body: await response.json() }
    }
    assert.equal((await research('ho-chi-minh-city')).status, 400)
    assert.equal(providerCalls, 0)
    const preview = await research('hanoi')
    assert.equal(preview.status, 200)
    assert.equal(preview.body.status, 'PREVIEW')
    assert.equal(preview.body.candidate.canonicalItemId, 'used-mobile-phone')
    assert.equal(preview.body.candidate.itemName, 'Used mobile phone')
    assert.equal(providerCalls, 1)
    const resolve = async (canonicalItemId, jurisdiction) => {
      const response = await fetch(`${origin}/api/resolve`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ canonicalItemId, jurisdiction, confirmed: true }),
      })
      assert.equal(response.status, 200)
      const result = await response.json()
      assert.equal(result.status, 'UNKNOWN')
      assert.equal(Object.hasOwn(result, 'instruction'), false)
      assert.match(result.asOf, /^\d{4}-\d{2}-\d{2}$/)
    }
    await resolve('used-mobile-phone', 'hanoi')
    await resolve('used-mobile-phone', 'ho-chi-minh-city')
    await resolve('used-power-bank', 'hanoi')
    await resolve('used-power-bank', 'ho-chi-minh-city')
  } finally {
    globalThis.fetch = originalFetch
    if (originalOrigins === undefined) delete process.env.SANITY_STUDIO_ORIGINS
    else process.env.SANITY_STUDIO_ORIGINS = originalOrigins
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})

test('research-source skips covered rules and returns only non-overlapping previews', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const originalFetch = globalThis.fetch
  const originalOrigins = process.env.SANITY_STUDIO_ORIGINS
  const originalApiKey = process.env.GEMINI_API_KEY
  process.env.SANITY_STUDIO_ORIGINS = 'https://studio.example'
  process.env.GEMINI_API_KEY = 'isolated-test-key'
  let rules = []
  let conflicts = []
  let providerCalls = 0
  const refs = [
    { title: 'Decision A', url: 'https://vbpl.vn/decision-a', citation: 'Article 1', sourceRole: 'binding-rule' },
    { title: 'Decision B', url: 'https://vbpl.vn/decision-b', citation: 'Article 2', sourceRole: 'currentness-record' },
  ]
  const candidate = {
    status: 'PREVIEW', canonicalItemId: 'old-mattress', itemName: 'Old mattress', jurisdiction: 'hanoi',
    disposalCategory: 'collection', instruction: 'Use municipal collection.', validFrom: '2000-01-01', validUntil: null,
    sourceReferences: refs,
    supportingPassages: refs.map((ref, index) => ({
      sourceTitle: ref.title, sourceUrl: ref.url, sourceCitation: ref.citation, sourceVersion: 'Current version',
      citation: 'Article 1', text: `Passage ${index}`,
      requires: [{title: refs[1 - index].title, url: refs[1 - index].url, citation: refs[1 - index].citation}],
      claimType: index ? 'currentness' : 'disposal',
    })),
  }
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.startsWith('http://127.0.0.1:')) return originalFetch(input, init)
    if (url.includes('/access/project/')) return new Response('{}', { status: 200 })
    if (url.includes('/data/query/')) return new Response(JSON.stringify({result: [...rules, ...conflicts]}), { status: 200 })
    providerCalls++
    const text = JSON.stringify(candidate)
    return new Response(JSON.stringify({ steps: [{
      type: 'model_output', content: [{ type: 'text', text, annotations: refs.map((ref) => ({
        type: 'url_citation', url: ref.url, start_index: 0, end_index: text.length,
      })) }],
    }] }), { status: 200 })
  }
  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const research = async () => {
      const response = await fetch(`${origin}/api/research-source`, {
        method: 'POST',
        headers: { origin: 'https://studio.example', authorization: 'Bearer isolated-token', 'content-type': 'application/json' },
        body: JSON.stringify({ canonicalItemId: 'old-mattress', jurisdiction: 'hanoi' }),
      })
      return { status: response.status, body: await response.json() }
    }
    rules = [{ validFrom: '2020-01-01', validUntil: null }]
    assert.equal((await research()).body.status, 'GAP')
    assert.equal(providerCalls, 0)

    rules = [{ validFrom: '1980-01-01', validUntil: '1990-01-01' }]
    const preview = await research()
    assert.equal(preview.status, 200)
    assert.equal(preview.body.status, 'PREVIEW')
    const { status: previewStatus, ...expectedCandidate } = candidate
    assert.equal(previewStatus, 'PREVIEW')
    assert.deepEqual(preview.body.candidate, expectedCandidate)

    rules = [{ validFrom: '1999-01-01', validUntil: '2001-01-01' }]
    assert.equal((await research()).body.status, 'GAP')
    assert.equal(providerCalls, 2)
    rules = []
    conflicts = [{
      _type: 'disposalConflict', validFrom: '2000-01-01', validUntil: null,
      summary: 'Current official sources disagree.',
      claims: [
        {sourceTitle: 'Notice A', sourceUrl: 'https://official.example/a', sourceVersion: '2020 edition', citation: 'Article 2', claim: 'Claim A.'},
        {sourceTitle: 'Notice B', sourceUrl: 'https://official.example/b', sourceVersion: '2020 edition', citation: 'Article 3', claim: 'Claim B.'},
      ],
    }]
    assert.equal((await research()).body.status, 'GAP')
    assert.equal(providerCalls, 2)
  } finally {
    globalThis.fetch = originalFetch
    if (originalOrigins === undefined) delete process.env.SANITY_STUDIO_ORIGINS
    else process.env.SANITY_STUDIO_ORIGINS = originalOrigins
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})
test('resolve selects published Sanity passages through the exact source/version gate', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const originalFetch = globalThis.fetch
  const source = { title: 'Decision 36/2024', url: 'https://official.example/decision-36', citation: 'Article 5(2)' }
  const version = { title: 'Decision 2736', url: 'https://official.example/decision-2736', citation: 'Article 1' }
  const passage = {
    sourceTitle: source.title, sourceUrl: source.url, sourceCitation: source.citation,
    sourceVersion: 'Decision 36 retained after Decision 2736', citation: 'Article 5(2)',
    text: 'Dispose through collection.', requires: [version], claimType: 'disposal',
  }
  let query
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.startsWith('http://127.0.0.1:')) return originalFetch(input, init)
    query = url
    return new Response(JSON.stringify({ result: [{
      canonicalItemId: 'old-mattress', itemName: 'Old mattress', disposalCategory: 'collection',
      instruction: 'Use collection.', validFrom: '2020-01-01', validUntil: null,
      sourceReferences: [source, version], supportingPassages: [passage, {...passage, claimType: 'unknown'}],
    }] }), { status: 200 })
  }
  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const response = await fetch(`${origin}/api/resolve`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ canonicalItemId: 'old-mattress', jurisdiction: 'hanoi', confirmed: true }),
    })
    assert.equal(response.status, 200)
    const result = await response.json()
    assert.equal(result.status, 'MATCHED')
    assert.deepEqual(result.supportingPassages, [{
      sourceTitle: passage.sourceTitle, sourceUrl: passage.sourceUrl, sourceCitation: passage.sourceCitation,
      sourceVersion: passage.sourceVersion, citation: passage.citation, text: passage.text,
      requires: [version], claimType: 'disposal',
    }])
    assert.match(query, /^https:\/\/xqeddep2\.api\.sanity\.io\/v2025-02-19\/data\/query\/production\?/)
    assert.match(decodeURIComponent(query), /supportingPassages/)
  } finally {
    globalThis.fetch = originalFetch
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})

test('published source conflicts override an active rule without exposing its action', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const originalFetch = globalThis.fetch
  const rule = {
    _type: 'disposalRule', canonicalItemId: 'old-mattress', itemName: 'Old mattress',
    disposalCategory: 'collection', instruction: 'Use collection.',
    validFrom: '2000-01-01', validUntil: null,
    sourceReferences: [{title: 'Rule', url: 'https://official.example/rule', citation: 'Article 1'}],
  }
  const conflict = {
    _type: 'disposalConflict', validFrom: '2000-01-01', validUntil: null,
    summary: 'Two current official sources disagree.',
    claims: [
      {sourceTitle: 'Notice A', sourceUrl: 'https://official.example/a', sourceVersion: '2020 edition', citation: 'Article 2', claim: 'Claim A.'},
      {sourceTitle: 'Notice B', sourceUrl: 'https://official.example/b', sourceVersion: '2020 edition', citation: 'Article 3', claim: 'Claim B.'},
    ],
  }
  let query
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.startsWith('http://127.0.0.1:')) return originalFetch(input, init)
    query = url
    return new Response(JSON.stringify({result: [rule, conflict]}), {status: 200})
  }
  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const response = await originalFetch(`${origin}/api/resolve`, {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({canonicalItemId: 'old-mattress', jurisdiction: 'hanoi', confirmed: true}),
    })
    assert.equal(response.status, 200)
    const result = await response.json()
    assert.equal(result.status, 'CONFLICT')
    assert.equal(Object.hasOwn(result, 'instruction'), false)
    assert.equal(Object.hasOwn(result, 'category'), false)
    assert.equal(result.conflicts[0].claims.length, 2)
    assert.match(decodeURIComponent(query), /disposalConflict/)
  } finally {
    globalThis.fetch = originalFetch
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})

test('explain route fails closed before data access with missing or unsafe configuration', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const originalFetch = globalThis.fetch
  const envNames = ['GEMINI_API_KEY', 'SANITY_CONTEXT_MCP_URL', 'SANITY_API_READ_TOKEN', 'SANITY_ORGANIZATION_TOKEN']
  const originalEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]))
  for (const name of envNames) delete process.env[name]
  let externalCalls = 0
  globalThis.fetch = async () => {
    externalCalls++
    throw new Error('The route should not call external services without configuration.')
  }
  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const response = await originalFetch(`${origin}/api/explain`, {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        canonicalItemId: 'old-mattress', jurisdiction: 'hanoi', question: 'Why?',
        history: [], confirmed: true,
      }),
    })
    assert.equal(response.status, 503)
    assert.match((await response.json()).error, /not configured/)
    assert.equal(externalCalls, 0)
    process.env.GEMINI_API_KEY = 'test-key'
    process.env.SANITY_CONTEXT_MCP_URL = 'https://evil.example/v1/context/organizations/org/mcp/whatbin'
    process.env.SANITY_ORGANIZATION_TOKEN = 'must-not-be-forwarded'
    const unsafeEndpoint = await originalFetch(`${origin}/api/explain`, {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        canonicalItemId: 'old-mattress', jurisdiction: 'hanoi', question: 'Why?',
        history: [], confirmed: true,
      }),
    })
    assert.equal(unsafeEndpoint.status, 503)
    assert.match((await unsafeEndpoint.json()).error, /not configured/)
    assert.equal(externalCalls, 0)
  } finally {
    globalThis.fetch = originalFetch
    for (const name of envNames) {
      if (originalEnv[name] === undefined) delete process.env[name]
      else process.env[name] = originalEnv[name]
    }
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})
