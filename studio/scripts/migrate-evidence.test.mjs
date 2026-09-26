import assert from 'node:assert/strict'
import test from 'node:test'
import {mapEvidence, samePassage} from './migrate-evidence.mjs'

const source = {title: 'Decision 1', url: 'https://example.gov.vn/1', citation: 'Articles 2 and 3'}
const requirement = {title: 'Official record', url: 'https://example.gov.vn/record', citation: 'Decision identity'}
const entry = {
  sourceTitle: source.title,
  sourceUrl: source.url,
  sourceCitation: source.citation,
  sourceVersion: 'Version 1',
  citation: 'Article 2',
  text: 'Exact quoted text',
  requires: [requirement],
}

test('recognizes an existing passage when Sanity reorders required-source object keys', () => {
  const passage = {...entry, claimType: 'disposal'}
  const existing = {
    ...passage,
    requires: [{citation: requirement.citation, title: requirement.title, url: requirement.url}],
  }
  assert.equal(samePassage(existing, passage), true)
  assert.equal(samePassage({...existing, text: 'Changed quoted text'}, passage), false)
})

test('maps only rules satisfying exact primary and required source references', () => {
  const rules = [
    {_id: 'match', sourceReferences: [source, requirement]},
    {_id: 'wrong-primary-citation', sourceReferences: [{...source, citation: 'Article 2'}, requirement]},
    {_id: 'missing-required', sourceReferences: [source]},
    {_id: 'wrong-required', sourceReferences: [source, {...requirement, url: 'https://example.gov.vn/other'}]},
  ]
  const mapped = mapEvidence([entry], rules)
  assert.deepEqual(mapped.get('match'), [{...entry, claimType: 'disposal'}])
  assert.deepEqual(mapped.get('wrong-primary-citation'), [])
  assert.deepEqual(mapped.get('missing-required'), [])
  assert.deepEqual(mapped.get('wrong-required'), [])
})

test('maps general evidence to every exact matching rule', () => {
  const rules = [
    {_id: 'first', sourceReferences: [source, requirement]},
    {_id: 'second', sourceReferences: [source, requirement]},
  ]
  const mapped = mapEvidence([entry], rules)
  assert.deepEqual(mapped.get('first'), [{...entry, claimType: 'disposal'}])
  assert.deepEqual(mapped.get('second'), [{...entry, claimType: 'disposal'}])
})

test('fails instead of dropping an entry with no exact rule match', () => {
  assert.throws(() => mapEvidence([entry], [{_id: 'rule', sourceReferences: []}]), /Unmatched evidence entries \(1\)/)
})
