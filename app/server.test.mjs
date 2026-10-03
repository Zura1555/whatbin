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

    for (const asset of ['/app.js', '/styles.css', '/vendor/lism-css/main.css']) {
      const response = await fetch(`${origin}${asset}`)
      assert.equal(response.status, 200, `${asset} should be served`)
    }

    const homeHtml = await (await fetch(`${origin}/`)).text()
    assert.match(homeHtml, /\/vendor\/lism-css\/main\.css/)

    const traversal = await fetch(`${origin}/%2e%2e%2fserver.mjs`)
    assert.equal(traversal.status, 403)
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})

test('GET /api/items exposes only the supported canonical item catalog', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))

  try {
    const { port } = server.address()
    const origin = `http://127.0.0.1:${port}`
    const response = await fetch(`${origin}/api/items`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), {
      items: [
        { canonicalItemId: 'old-mattress', itemName: 'Old mattress' },
        { canonicalItemId: 'used-household-battery', itemName: 'Used household battery' },
        { canonicalItemId: 'used-lithium-ion-battery', itemName: 'Used rechargeable lithium-ion battery' },
        { canonicalItemId: 'used-mobile-phone', itemName: 'Used mobile phone' },
        { canonicalItemId: 'used-fluorescent-lamp', itemName: 'Used fluorescent lamp' },
        { canonicalItemId: 'used-mercury-thermometer', itemName: 'Used mercury thermometer' },
        { canonicalItemId: 'cooked-food-scrap', itemName: 'Cooked food scrap' },
        { canonicalItemId: 'fruit-vegetable-peel', itemName: 'Raw fruit and vegetable peel' },
        { canonicalItemId: 'fallen-leaves-garden-waste', itemName: 'Fallen leaves and garden waste' },
        { canonicalItemId: 'discarded-coconut-shell', itemName: 'Discarded coconut shell' },
        { canonicalItemId: 'large-animal-bone', itemName: 'Large animal bone' },
        { canonicalItemId: 'pet-plastic-bottle', itemName: 'PET plastic beverage bottle' },
        { canonicalItemId: 'corrugated-cardboard-box', itemName: 'Corrugated cardboard box' },
        { canonicalItemId: 'aluminum-beverage-can', itemName: 'Aluminum beverage can' },
        { canonicalItemId: 'glass-bottle-jar', itemName: 'Glass bottle or jar' },
        { canonicalItemId: 'expired-household-medicine', itemName: 'Expired household medicine' },
        { canonicalItemId: 'used-cooking-oil', itemName: 'Used cooking oil' },
        { canonicalItemId: 'aerosol-spray-can', itemName: 'Aerosol spray can' },
        { canonicalItemId: 'household-pesticide-container', itemName: 'Household pesticide container' },
        { canonicalItemId: 'discarded-wooden-furniture', itemName: 'Discarded wooden furniture' },
        { canonicalItemId: 'discarded-upholstered-sofa', itemName: 'Discarded upholstered sofa' },
        { canonicalItemId: 'discarded-electric-fan', itemName: 'Discarded electric fan' },
        { canonicalItemId: 'discarded-laptop', itemName: 'Discarded laptop computer' },
        { canonicalItemId: 'discarded-microwave-oven', itemName: 'Discarded microwave oven' },
        { canonicalItemId: 'discarded-charging-cable', itemName: 'Discarded charging cable' },
        { canonicalItemId: 'disposable-baby-diaper', itemName: 'Disposable baby diaper' },
        { canonicalItemId: 'broken-ceramic-tableware', itemName: 'Broken ceramic dish or shards' },
        { canonicalItemId: 'multi-layer-snack-packaging', itemName: 'Multi-layer snack packaging' },
        { canonicalItemId: 'used-motor-oil', itemName: 'Used motorbike engine motor oil' },
        { canonicalItemId: 'used-lead-acid-accumulator', itemName: 'Discarded motorbike lead-acid battery' },
        { canonicalItemId: 'used-motorbike-tire', itemName: 'Used motorbike tires and inner tubes' },
        { canonicalItemId: 'discarded-motorbike-helmet', itemName: 'Discarded motorbike helmet' },
        { canonicalItemId: 'beverage-carton-tetra-pak', itemName: 'Aseptic multi-layer beverage carton' },
        { canonicalItemId: 'polystyrene-foam-box', itemName: 'Expanded polystyrene foam box' },
        { canonicalItemId: 'single-use-plastic-bag', itemName: 'Single-use plastic carrier bag' },
        { canonicalItemId: 'plastic-bubble-wrap', itemName: 'Plastic bubble wrap packaging' },
        { canonicalItemId: 'renovation-rubble-tiles', itemName: 'Minor home renovation rubble and tiles' },
        { canonicalItemId: 'discarded-ceramic-toilet-sink', itemName: 'Discarded ceramic toilet or sink' },
        { canonicalItemId: 'used-clothing-textile', itemName: 'Wearable second-hand clothing' },
        { canonicalItemId: 'worn-out-footwear', itemName: 'Old worn-out shoes and footwear' },
        { canonicalItemId: 'used-medical-mask', itemName: 'Used disposable medical mask' },
        { canonicalItemId: 'household-medical-sharps', itemName: 'Household medical sharps and needles' },
        { canonicalItemId: 'discarded-nail-polish-bottle', itemName: 'Nail polish and solvent bottle' },
        { canonicalItemId: 'leftover-paint-can', itemName: 'Leftover household paint can' },
        { canonicalItemId: 'incense-joss-paper-ash', itemName: 'Incense ash and joss paper ash' },
        { canonicalItemId: 'coffee-grounds-tea-leaves', itemName: 'Coffee grounds and loose tea leaves' },
      ],
    })
    assert.equal((await fetch(`${origin}/api/items`, { method: 'POST' })).status, 405)
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
  const originalOpenRouterKey = process.env.OPENROUTER_API_KEY
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
  delete process.env.OPENROUTER_API_KEY
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
    if (originalOpenRouterKey === undefined) delete process.env.OPENROUTER_API_KEY
    else process.env.OPENROUTER_API_KEY = originalOpenRouterKey
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})
test('recognition uses OpenRouter Jev for text and configurable chat models for images and other models', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))

  const originalFetch = globalThis.fetch
  const envNames = ['GEMINI_API_KEY', 'OPENROUTER_API_KEY', 'OPENROUTER_CLASSIFICATION_MODEL', 'OPENROUTER_VISION_MODEL']
  const originalEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]))
  process.env.OPENROUTER_API_KEY = 'openrouter-test-key'
  process.env.OPENROUTER_CLASSIFICATION_MODEL = 'typesafe/jev-1.13'
  process.env.OPENROUTER_VISION_MODEL = 'google/gemini-test-vision'
  delete process.env.GEMINI_API_KEY
  let jevRequest
  let completionRequest
  let answer = {type: 'choice', choice: 'used-mobile-phone', confidence: 0.9, probabilities: {'used-mobile-phone': 0.9}}
  let mockedCandidate = {supported: true, confidence: 0.9, canonicalItemId: 'used-mobile-phone', itemName: 'Used mobile phone'}
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.startsWith('http://127.0.0.1:')) return originalFetch(input, init)
    const request = {url, headers: init.headers, body: JSON.parse(init.body)}
    if (url.endsWith('/api/alpha/decisions')) {
      jevRequest = request
      return new Response(JSON.stringify({answers: {item: answer}}), {status: 200})
    }
    if (url.endsWith('/api/v1/chat/completions')) {
      completionRequest = request
      return new Response(JSON.stringify({choices: [{message: {content: JSON.stringify(mockedCandidate)}}]}), {status: 200})
    }
    throw new Error(`Unexpected external request: ${url}`)
  }

  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const recognize = async (body) => {
      const response = await originalFetch(`${origin}/api/recognize`, {
        method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body),
      })
      assert.equal(response.status, 200)
      return response.json()
    }

    assert.deepEqual((await recognize({description: 'discarded whole mobile phone'})).candidate, {
      canonicalItemId: 'used-mobile-phone', itemName: 'Used mobile phone',
    })
    assert.equal(jevRequest.url, 'https://openrouter.ai/api/alpha/decisions')
    assert.equal(jevRequest.headers.authorization, 'Bearer openrouter-test-key')
    assert.equal(jevRequest.body.model, 'typesafe/jev-1.13')
    assert.equal(jevRequest.body.state.description, 'discarded whole mobile phone')
    assert.ok(jevRequest.body.questions.item.criteria.unsupported)

    answer = {...answer, confidence: 0.79}
    assert.equal((await recognize({description: 'possibly a mobile phone'})).candidate, null)

    process.env.OPENROUTER_CLASSIFICATION_MODEL = 'openai/custom-classifier'
    mockedCandidate = {supported: true, confidence: 0.9, canonicalItemId: 'used-power-bank', itemName: 'Used power bank'}
    assert.deepEqual((await recognize({description: 'complete discarded power bank'})).candidate, {
      canonicalItemId: 'used-power-bank', itemName: 'Used power bank',
    })
    assert.equal(completionRequest.body.model, 'openai/custom-classifier')

    mockedCandidate = {supported: true, confidence: 0.9, canonicalItemId: 'used-mercury-thermometer', itemName: 'Used mercury thermometer'}
    assert.deepEqual((await recognize({image: {mimeType: 'image/jpeg', base64: 'AA=='}})).candidate, {
      canonicalItemId: 'used-mercury-thermometer', itemName: 'Used mercury thermometer',
    })
    assert.equal(completionRequest.body.model, 'google/gemini-test-vision')
    assert.equal(completionRequest.body.messages[0].content[1].image_url.url, 'data:image/jpeg;base64,AA==')
    mockedCandidate = {supported: true, confidence: 0.9, canonicalItemId: 'used-fluorescent-lamp', itemName: 'Used fluorescent lamp'}
    assert.deepEqual((await recognize({image: {mimeType: 'image/jpeg', base64: 'AA=='}})).candidate, {
      canonicalItemId: 'used-fluorescent-lamp', itemName: 'Used fluorescent lamp',
    })
  } finally {
    globalThis.fetch = originalFetch
    for (const name of envNames) {
      if (originalEnv[name] === undefined) delete process.env[name]
      else process.env[name] = originalEnv[name]
    }
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})
test('recognize handles base64 image requests with Gemini and enforces validation', async () => {
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))

  const originalFetch = globalThis.fetch
  const originalApiKey = process.env.GEMINI_API_KEY
  const originalOpenRouterKey = process.env.OPENROUTER_API_KEY
  delete process.env.OPENROUTER_API_KEY
  process.env.GEMINI_API_KEY = 'test-gemini-key'

  let geminiPayload
  const sampleCandidate = {
    supported: true,
    confidence: 0.95,
    canonicalItemId: 'pet-plastic-bottle',
    itemName: 'PET plastic beverage bottle',
  }

  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.startsWith('http://127.0.0.1:')) return originalFetch(input, init)
    if (url.includes('generativelanguage.googleapis.com')) {
      geminiPayload = JSON.parse(init.body)
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify(sampleCandidate) }] } }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    throw new Error(`Unexpected external request: ${url}`)
  }

  try {
    const origin = `http://127.0.0.1:${server.address().port}`
    const postRecognize = async (body) => {
      const response = await originalFetch(`${origin}/api/recognize`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      return { status: response.status, data: await response.json() }
    }

    const validBase64 = Buffer.from('test-image-binary-data').toString('base64')
    const imgOnly = await postRecognize({
      image: { mimeType: 'image/jpeg', base64: validBase64 },
    })
    assert.equal(imgOnly.status, 200)
    assert.deepEqual(imgOnly.data.candidate, {
      canonicalItemId: 'pet-plastic-bottle',
      itemName: 'PET plastic beverage bottle',
    })
    assert.equal(geminiPayload.contents[0].parts.length, 2)
    assert.equal(geminiPayload.contents[0].parts[1].inlineData.mimeType, 'image/jpeg')
    assert.equal(geminiPayload.contents[0].parts[1].inlineData.data, validBase64)

    const imgAndDesc = await postRecognize({
      image: { mimeType: 'image/png', base64: validBase64 },
      description: 'clear water bottle',
    })
    assert.equal(imgAndDesc.status, 200)
    assert.deepEqual(imgAndDesc.data.candidate, {
      canonicalItemId: 'pet-plastic-bottle',
      itemName: 'PET plastic beverage bottle',
    })
    assert.match(geminiPayload.contents[0].parts[0].text, /attached image and this description: clear water bottle/)

    const badMime = await postRecognize({
      image: { mimeType: 'image/gif', base64: validBase64 },
    })
    assert.equal(badMime.status, 400)
    assert.equal(badMime.data.error, 'Provide a valid description, supported image, or both.')

    const badBase64 = await postRecognize({
      image: { mimeType: 'image/jpeg', base64: 'not-valid-base64!!@#' },
    })
    assert.equal(badBase64.status, 400)

    const emptyObj = await postRecognize({})
    assert.equal(emptyObj.status, 400)
  } finally {
    globalThis.fetch = originalFetch
    if (originalOpenRouterKey === undefined) delete process.env.OPENROUTER_API_KEY
    else process.env.OPENROUTER_API_KEY = originalOpenRouterKey
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
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
  const envNames = ['GEMINI_API_KEY', 'OPENROUTER_API_KEY', 'SANITY_CONTEXT_MCP_URL', 'SANITY_API_READ_TOKEN', 'SANITY_ORGANIZATION_TOKEN']
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
