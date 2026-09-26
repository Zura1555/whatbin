import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer, matchSupportingPassages, selectActiveRule } from './application.mjs'

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
  }

  assert.deepEqual(matchSupportingPassages([source, version], [passage]), [{
    sourceTitle: source.title, sourceUrl: source.url, sourceVersion: passage.sourceVersion,
    citation: passage.citation, text: passage.text,
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

test('recognize accepts only exact lithium-ion battery and power-bank candidate pairs', async () => {
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
    assert.match(prompt, /"used-household-battery".*"Used household battery".*AA or AAA/)

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
