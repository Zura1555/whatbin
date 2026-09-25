import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer, matchSupportingPassages, selectActiveRule } from './server.mjs'

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
