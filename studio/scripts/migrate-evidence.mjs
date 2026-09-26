import {readFile} from 'node:fs/promises'
import console from 'node:console'
import process from 'node:process'
import {fileURLToPath, URL} from 'node:url'
const projectId = 'xqeddep2'
const dataset = 'production'
const apiVersion = '2025-07-11'
const api = `https://${projectId}.api.sanity.io/v${apiVersion}`
const sourcePath = fileURLToPath(new URL('../../app/knowledge-base.json', import.meta.url))

const sameSource = (left, right) =>
  left?.title === right?.title && left?.url === right?.url && left?.citation === right?.citation

function validText(value, max) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max
}

function isHttpUrl(value) {
  try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
}

function validEntry(entry) {
  return validText(entry?.sourceTitle, 500) && isHttpUrl(entry.sourceUrl) &&
    validText(entry.sourceCitation, 500) && validText(entry.sourceVersion, 500) &&
    validText(entry.citation, 500) && validText(entry.text, 5000) &&
    Array.isArray(entry.requires) && entry.requires.length > 0
}

export function mapEvidence(entries, rules) {
  const mapped = new Map(rules.map((rule) => [rule._id, []]))
  const unmatched = []

  for (const entry of entries) {
    if (!validEntry(entry)) throw new Error(`Invalid evidence entry: ${entry?.sourceTitle ?? '(missing source title)'}`)
    const matches = rules.filter((rule) =>
      Array.isArray(rule.sourceReferences) &&
      rule.sourceReferences.some((reference) => sameSource(reference, {
        title: entry.sourceTitle, url: entry.sourceUrl, citation: entry.sourceCitation,
      })) &&
      entry.requires.every((required) => rule.sourceReferences.some((reference) => sameSource(reference, required))),
    )
    if (!matches.length) {
      unmatched.push(entry)
      continue
    }
    const passage = {
      sourceTitle: entry.sourceTitle,
      sourceUrl: entry.sourceUrl,
      sourceCitation: entry.sourceCitation,
      sourceVersion: entry.sourceVersion,
      citation: entry.citation,
      text: entry.text,
      requires: entry.requires,
      claimType: 'disposal',
    }
    for (const rule of matches) mapped.get(rule._id).push(passage)
  }

  if (unmatched.length) {
    throw new Error(`Unmatched evidence entries (${unmatched.length}): ${unmatched.map(({sourceTitle, citation}) => `${sourceTitle} — ${citation}`).join('; ')}`)
  }
  return mapped
}

export function samePassage(a, b) {
  return ['sourceTitle', 'sourceUrl', 'sourceCitation', 'sourceVersion', 'citation', 'text', 'claimType'].every((key) => a?.[key] === b[key]) &&
    Array.isArray(a?.requires) && Array.isArray(b?.requires) &&
    a.requires.length === b.requires.length &&
    a.requires.every((required, index) => sameSource(required, b.requires[index]))
}

async function request(path, options = {}) {
  const response = await globalThis.fetch(`${api}${path}`, options)
  if (!response.ok) throw new Error(`Sanity API ${response.status}: ${await response.text()}`)
  return response.json()
}

async function main() {
  const writeMode = process.argv.includes('--write')
  const token = process.env.SANITY_API_TOKEN
  if (writeMode && !token) throw new Error('--write requires SANITY_API_TOKEN')

  let entries
  try {
    entries = JSON.parse(await readFile(sourcePath, 'utf8'))
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`Invalid JSON in app/knowledge-base.json: ${error.message}`, {cause: error})
    throw error
  }
  const headers = token ? {Authorization: `Bearer ${token}`} : {}
  const query = encodeURIComponent('*[_type == "disposalRule" && !(_id in path("drafts.**"))]{_id, sourceReferences, supportingPassages}')
  const result = await request(`/data/query/${dataset}?query=${query}`, {headers})
  const rules = result.result
  if (!Array.isArray(rules)) throw new Error('Sanity query returned no rule list')

  const mapped = mapEvidence(entries, rules)
  const mutations = []
  for (const rule of rules) {
    const additions = (mapped.get(rule._id) ?? []).filter((passage) =>
      !(rule.supportingPassages ?? []).some((existing) => samePassage(existing, passage)),
    )
    if (additions.length) mutations.push({id: rule._id, additions})
  }

  const count = mutations.reduce((total, mutation) => total + mutation.additions.length, 0)
  if (!writeMode) {
    console.log(`Dry run: ${count} passage(s) would be added to ${mutations.length} published rule(s). Re-run with --write and SANITY_API_TOKEN to apply.`)
    return
  }
  if (!count) {
    console.log('No changes needed; all matching passages are already present.')
    return
  }

  const mutationsPayload = mutations.flatMap(({id, additions}) => [
    {patch: {id, setIfMissing: {supportingPassages: []}}},
    {patch: {id, insert: {after: 'supportingPassages[-1]', items: additions}}},
  ])
  await request(`/data/mutate/${dataset}?returnIds=true`, {
    method: 'POST',
    headers: {...headers, 'Content-Type': 'application/json'},
    body: JSON.stringify({mutations: mutationsPayload}),
  })
  console.log(`Added ${count} passage(s) to ${mutations.length} published rule(s).`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
