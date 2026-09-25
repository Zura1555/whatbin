import { createServer as createHttpServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('./public/', import.meta.url)))
const MAX_BODY = 9 * 1024 * 1024
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent'
const SANITY_URL = 'https://xqeddep2.api.sanity.io/v2025-02-19/data/query/production'
const KNOWLEDGE_BASE_PATH = resolve(fileURLToPath(new URL('./knowledge-base.json', import.meta.url)))
const knowledgeBase = readFile(KNOWLEDGE_BASE_PATH, 'utf8')
  .then((contents) => {
    let entries
    try { entries = JSON.parse(contents) } catch { return [] }
    return Array.isArray(entries) ? entries : []
  })
  .catch(() => [])
const JURISDICTIONS = {
  hanoi: 'Asia/Ho_Chi_Minh',
  'ho-chi-minh-city': 'Asia/Ho_Chi_Minh',
}
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon',
}

function send(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(value))
}

async function bodyJson(req) {
  const length = Number(req.headers['content-length'])
  if (Number.isFinite(length) && length > MAX_BODY) throw Object.assign(new Error('Request body is too large.'), { status: 413 })
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) throw Object.assign(new Error('Request body is too large.'), { status: 413 })
    chunks.push(chunk)
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
    return value
  } catch {
    throw Object.assign(new Error('Request body must be a JSON object.'), { status: 400 })
  }
}

function validText(value, max) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max
}

function validImage(image) {
  if (!image || typeof image !== 'object' || !['image/jpeg', 'image/png', 'image/webp'].includes(image.mimeType)) return false
  if (typeof image.base64 !== 'string' || image.base64.length === 0 || image.base64.length > MAX_BODY) return false
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.base64)) return false
  const bytes = Buffer.from(image.base64, 'base64')
  return bytes.length > 0 && bytes.toString('base64') === image.base64 && bytes.length <= MAX_BODY - 1024
}

async function recognize(input) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw Object.assign(new Error('Recognition is unavailable: GEMINI_API_KEY is not configured.'), { status: 503 })
  const image = input.image
  const description = validText(input.description, 4000) ? input.description.trim() : null
  const prompt = `Identify a household item${image && description ? ` using the attached image and this description: ${description}` : image ? ' from the attached image' : ` from this description: ${description}`}. The only supported items are canonicalItemId "old-mattress", itemName "Old mattress" (an old or used household mattress being discarded), and canonicalItemId "used-household-battery", itemName "Used household battery" (a clearly identified discarded, intact household-size AA or AAA cell). For batteries, reject vehicle or industrial batteries, device-installed packs, damaged or leaking cells, and any battery not clearly identified as an intact household-size AA or AAA cell. Return supported=true with exactly the matching ID and item name only when the input clearly matches one of these items; otherwise return supported=false and both candidate fields null. Do not invent IDs or infer disposal rules. Require high confidence; treat ambiguous, composite, or unsupported items as unsupported.`
  const contents = [{ text: prompt }]
  if (image) contents.push({ inlineData: { mimeType: image.mimeType, data: image.base64 } })
  const response = await fetch(GEMINI_URL, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      store: false,
      contents: [{ parts: contents }], generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: { type: 'OBJECT', properties: {
          supported: { type: 'BOOLEAN' }, confidence: { type: 'NUMBER' },
          canonicalItemId: { type: 'STRING', nullable: true }, itemName: { type: 'STRING', nullable: true },
        }, required: ['supported', 'confidence', 'canonicalItemId', 'itemName'] },
      },
    }),
  })
  if (!response.ok) throw Object.assign(new Error('Recognition provider request failed.'), { status: 502 })
  let envelope
  try { envelope = await response.json() } catch { throw Object.assign(new Error('Recognition provider returned invalid data.'), { status: 502 }) }
  const text = envelope?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('')
  let result
  try { result = JSON.parse(text) } catch { throw Object.assign(new Error('Recognition provider returned invalid data.'), { status: 502 }) }
  const validCandidate = result?.supported === true && typeof result.confidence === 'number' && result.confidence >= 0.8 && result.confidence <= 1 &&
    ((result.canonicalItemId === 'old-mattress' && result.itemName === 'Old mattress') ||
      (result.canonicalItemId === 'used-household-battery' && result.itemName === 'Used household battery'))
  return validCandidate
    ? { candidate: { canonicalItemId: result.canonicalItemId, itemName: result.itemName.trim() } }
    : { candidate: null, message: 'The item could not be identified with enough certainty. Try a clearer photo or description.' }
}

function localDate(timeZone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}


function isHttpUrl(value) {
  try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function selectActiveRule(rules, date) {
  const active = rules.filter((rule) => {
    if (!rule || !validDate(rule.validFrom) ||
      (rule.validUntil !== null && rule.validUntil !== undefined && !validDate(rule.validUntil))) {
      throw new TypeError('Published rule has invalid effective dates.')
    }
    return rule.validFrom <= date && (!rule.validUntil || date < rule.validUntil)
  })
  if (active.length > 1) return { status: 'CONFLICT' }
  if (active.length === 0) return { status: 'UNKNOWN' }
  return { status: 'MATCHED', rule: active[0] }
}

function sameSource(left, right) {
  return left?.title === right?.title && left?.url === right?.url && left?.citation === right?.citation
}

export function matchSupportingPassages(sourceReferences, entries) {
  if (!Array.isArray(sourceReferences) || !Array.isArray(entries)) return []
  return entries.filter((entry) =>
    validText(entry?.sourceTitle, 500) && isHttpUrl(entry.sourceUrl) &&
    validText(entry?.sourceCitation, 500) && validText(entry?.sourceVersion, 500) &&
    validText(entry?.citation, 500) && validText(entry?.text, 5000) &&
    sourceReferences.some((reference) => sameSource(reference, {
      title: entry.sourceTitle, url: entry.sourceUrl, citation: entry.sourceCitation,
    })) &&
    Array.isArray(entry.requires) && entry.requires.length > 0 &&
    entry.requires.every((required) => sourceReferences.some((reference) => sameSource(reference, required))),
  ).map(({ sourceTitle, sourceUrl, sourceVersion, citation, text }) =>
    ({ sourceTitle, sourceUrl, sourceVersion, citation, text }))
}


async function resolveRule(input) {
  const query = '*[_type == "disposalRule" && !(_id in path("drafts.**")) && jurisdiction == $jurisdiction && canonicalItemId == $canonicalItemId]{canonicalItemId,itemName,disposalCategory,instruction,validFrom,validUntil,sourceReferences}'
  const params = new URLSearchParams({
    query,
    perspective: 'published',
    '$jurisdiction': JSON.stringify(input.jurisdiction),
    '$canonicalItemId': JSON.stringify(input.canonicalItemId),
  })
  const response = await fetch(`${SANITY_URL}?${params}`, { signal: AbortSignal.timeout(10000), headers: { accept: 'application/json' } })
  if (!response.ok) throw Object.assign(new Error('Rule service is unavailable.'), { status: 502 })
  let payload
  try { payload = await response.json() } catch { throw Object.assign(new Error('Rule service returned invalid data.'), { status: 502 }) }
  if (!Array.isArray(payload?.result)) throw Object.assign(new Error('Rule service returned invalid data.'), { status: 502 })
  const today = localDate(JURISDICTIONS[input.jurisdiction])
  let selection
  try {
    selection = selectActiveRule(payload.result, today)
  } catch {
    throw Object.assign(new Error('Published rule has invalid effective dates.'), { status: 502 })
  }
  if (selection.status !== 'MATCHED') return selection
  const rule = selection.rule
  if (![rule.canonicalItemId, rule.itemName, rule.disposalCategory, rule.instruction].every((value) => validText(value, 5000)) ||
    !Array.isArray(rule.sourceReferences) || !rule.sourceReferences.length || rule.sourceReferences.some((source) =>
      !validText(source?.title, 500) || !validText(source?.citation, 500) || !isHttpUrl(source?.url))) {
    throw Object.assign(new Error('Published rule has invalid content.'), { status: 502 })
  }
  return { status: 'MATCHED', itemName: rule.itemName, category: rule.disposalCategory, instruction: rule.instruction,
    validFrom: rule.validFrom, validUntil: rule.validUntil ?? null, sourceReferences: rule.sourceReferences,
    supportingPassages: matchSupportingPassages(rule.sourceReferences, await knowledgeBase) }
}

async function serveStatic(req, res, pathname) {
  let decoded
  try { decoded = decodeURIComponent(pathname) } catch { send(res, 400, { error: 'Invalid URL path.' }); return }
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '')
  const filename = resolve(ROOT, relative)
  if (filename !== ROOT && !filename.startsWith(ROOT + sep)) { send(res, 403, { error: 'Forbidden.' }); return }
  try {
    let info = await stat(filename)
    let target = filename
    if (info.isDirectory()) { target = resolve(filename, 'index.html'); info = await stat(target) }
    if (!info.isFile()) throw new Error('Not a file')
    const data = await readFile(target)
    res.writeHead(200, { 'content-type': MIME_TYPES[extname(target).toLowerCase()] ?? 'application/octet-stream', 'content-length': data.length, 'x-content-type-options': 'nosniff' })
    res.end(req.method === 'HEAD' ? undefined : data)
  } catch { send(res, 404, { error: 'Not found.' }) }
}

export function createServer() {
  return createHttpServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    try {
      if (url.pathname === '/api/recognize') {
        if (req.method !== 'POST') { send(res, 405, { error: 'Method not allowed.' }); return }
        const input = await bodyJson(req)
        const hasDescription = input.description !== undefined
        const hasImage = input.image !== undefined
        if ((!hasDescription && !hasImage) || (hasDescription && !validText(input.description, 4000)) || (hasImage && !validImage(input.image))) {
          send(res, 400, { error: 'Provide a valid description, supported image, or both.' }); return
        }
        send(res, 200, await recognize(input)); return
      }
      if (url.pathname === '/api/resolve') {
        if (req.method !== 'POST') { send(res, 405, { error: 'Method not allowed.' }); return }
        const input = await bodyJson(req)
        if (!Object.hasOwn(JURISDICTIONS, input.jurisdiction) || !validText(input.canonicalItemId, 100) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.canonicalItemId) || input.confirmed !== true) {
          send(res, 400, { error: 'A valid jurisdiction, canonical item ID, and explicit confirmation are required.' }); return
        }
        send(res, 200, await resolveRule(input)); return
      }
      if (url.pathname.startsWith('/api/')) { send(res, 404, { error: 'Not found.' }); return }
      if (req.method !== 'GET' && req.method !== 'HEAD') { send(res, 405, { error: 'Method not allowed.' }); return }
      await serveStatic(req, res, url.pathname)
    } catch (error) {
      if (!res.headersSent) send(res, error.status ?? 502, { error: error.status ? error.message : 'The service could not complete the request.' })
    }
  })
}


if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000)
  createServer().listen(port, () => console.log(`WhatBin server listening on http://localhost:${port}`))
}
