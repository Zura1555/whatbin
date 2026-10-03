import { once } from 'node:events'
import { createServer as createHttpServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { researchSource } from './source-research.mjs'
import {startExplanationStream, requireContextAgentConfiguration, validConversationHistory} from './context-agent.mjs'

const ROOT = resolve(fileURLToPath(new URL('./public/', import.meta.url)))
const MAX_BODY = 9 * 1024 * 1024
const SANITY_URL = 'https://xqeddep2.api.sanity.io/v2025-02-19/data/query/production'
const SANITY_ACCESS_URL = 'https://api.sanity.io/v2025-07-11/access/project/xqeddep2/user-permissions/me'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent'
const OPENROUTER_COMPLETIONS_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_DECISIONS_URL = 'https://openrouter.ai/api/alpha/decisions'
const RECOGNITION_CATEGORIES = new Map([
  ['old-mattress', {name: 'Old mattress', criteria: 'An old or used household mattress being discarded.'}],
  ['used-household-battery', {name: 'Used household battery', criteria: 'A clearly identified discarded, intact household-size AA or AAA cell.'}],
  ['used-lithium-ion-battery', {name: 'Used rechargeable lithium-ion battery', criteria: 'A discarded rechargeable lithium-ion cell or standalone battery pack that is not installed in a device and is not a complete power bank.'}],
  ['used-mobile-phone', {name: 'Used mobile phone', criteria: 'A discarded whole mobile phone as one household electronic item, not an accessory or separate battery.'}],
  ['used-power-bank', {name: 'Used power bank', criteria: 'A complete discarded power bank as a whole item, not a standalone battery.'}],
  ['used-mercury-thermometer', {name: 'Used mercury thermometer', criteria: 'A clearly identified discarded household mercury thermometer, not a digital or other non-mercury thermometer.'}],
])
const ITEM_NAMES = new Map([
  ['old-mattress', 'Old mattress'],
  ['used-household-battery', 'Used household battery'],
  ['used-lithium-ion-battery', 'Used rechargeable lithium-ion battery'],
  ['used-mobile-phone', 'Used mobile phone'],
  ['used-fluorescent-lamp', 'Used fluorescent lamp'],
  ['used-mercury-thermometer', 'Used mercury thermometer'],
])
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
  const openRouterKey = process.env.OPENROUTER_API_KEY
  const key = process.env.GEMINI_API_KEY
  if (!openRouterKey && !key) throw Object.assign(new Error('Recognition is unavailable: configure GEMINI_API_KEY or OPENROUTER_API_KEY.'), { status: 503 })
  const image = input.image
  const description = validText(input.description, 4000) ? input.description.trim() : null
  const prompt = `Identify a household item${image && description ? ` using the attached image and this description: ${description}` : image ? ' from the attached image' : ` from this description: ${description}`}. The only supported items are canonicalItemId "old-mattress", itemName "Old mattress" (an old or used household mattress being discarded); canonicalItemId "used-household-battery", itemName "Used household battery" (a clearly identified discarded, intact household-size AA or AAA cell); canonicalItemId "used-lithium-ion-battery", itemName "Used rechargeable lithium-ion battery" (a clearly identified discarded rechargeable lithium-ion cell or battery pack that is not installed in a device; do not use this category for batteries still installed in devices, whole devices including power banks, other battery chemistries, chargers, or uncertain items); canonicalItemId "used-power-bank", itemName "Used power bank" (a clearly identified complete discarded portable power bank as a whole item; never identify a whole power bank as a standalone battery); canonicalItemId "used-mobile-phone", itemName "Used mobile phone" (a clearly identified discarded whole mobile phone as one household electronic item; do not use for phone accessories, standalone batteries, batteries installed in a device as separate items, or complete power banks); canonicalItemId "used-fluorescent-lamp", itemName "Used fluorescent lamp" (a clearly identified discarded fluorescent tube or compact fluorescent bulb, whether intact or broken); canonicalItemId "used-mercury-thermometer", itemName "Used mercury thermometer" (a clearly identified discarded mercury thermometer). Do not infer from an uncertain image or description. Return JSON with supported, confidence from 0 to 1, canonicalItemId, and exact itemName. If no supported item is clearly identified, set supported false, confidence below 0.8, canonicalItemId null, and itemName null.`
  if (openRouterKey) {
    const classificationModel = process.env.OPENROUTER_CLASSIFICATION_MODEL || 'typesafe/jev-1.13'
    const model = image
      ? process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.5-flash'
      : classificationModel
    const result = !image && /^(?:~)?typesafe\/jev-(?:\d|latest)/.test(classificationModel)
      ? await classifyWithJev(openRouterKey, classificationModel, description)
      : await classifyWithOpenRouter(openRouterKey, model, prompt, image)
    return recognitionResponse(result)
  }
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
  return recognitionResponse(result)
}

async function postOpenRouter(url, apiKey, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify(body),
  })
  if (!response.ok) throw Object.assign(new Error('Recognition provider request failed.'), { status: 502 })
  try { return await response.json() } catch {
    throw Object.assign(new Error('Recognition provider returned invalid data.'), { status: 502 })
  }
}

async function classifyWithJev(apiKey, model, description) {
  const criteria = Object.fromEntries([...RECOGNITION_CATEGORIES].map(([id, item]) => [id, item.criteria]))
  criteria.unsupported = 'Any other item, an item that is unclear or uncertain, or an item that does not meet one supported category exactly.'
  const envelope = await postOpenRouter(OPENROUTER_DECISIONS_URL, apiKey, {
    model,
    state: { description },
    questions: {
      item: {
        type: 'choice',
        instructions: 'Which single supported discarded household item is clearly identified by the description? Choose unsupported for ambiguity, uncertainty, accessories, or anything outside the listed categories.',
        criteria,
      },
    },
  })
  const answer = envelope?.answers?.item
  if (answer?.type !== 'choice' || typeof answer.choice !== 'string' ||
    typeof answer.confidence !== 'number' || answer.confidence < 0 || answer.confidence > 1) {
    throw Object.assign(new Error('Recognition provider returned invalid data.'), { status: 502 })
  }
  const item = RECOGNITION_CATEGORIES.get(answer.choice)
  return {
    supported: Boolean(item) && answer.confidence >= 0.8,
    confidence: answer.confidence,
    canonicalItemId: answer.choice,
    itemName: item?.name ?? null,
  }
}

async function classifyWithOpenRouter(apiKey, model, prompt, image) {
  const content = [{ type: 'text', text: prompt }]
  if (image) content.push({ type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.base64}` } })
  const envelope = await postOpenRouter(OPENROUTER_COMPLETIONS_URL, apiKey, {
    model,
    messages: [{ role: 'user', content }],
    temperature: 0,
    max_tokens: 300,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'item_recognition',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            supported: { type: 'boolean' },
            confidence: { type: 'number' },
            canonicalItemId: { type: ['string', 'null'] },
            itemName: { type: ['string', 'null'] },
          },
          required: ['supported', 'confidence', 'canonicalItemId', 'itemName'],
          additionalProperties: false,
        },
      },
    },
  })
  const output = envelope?.choices?.[0]?.message?.content
  try {
    const result = JSON.parse(output)
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error()
    return result
  } catch {
    throw Object.assign(new Error('Recognition provider returned invalid data.'), { status: 502 })
  }
}

function recognitionResponse(result) {
  const item = RECOGNITION_CATEGORIES.get(result?.canonicalItemId)
  const validCandidate = result?.supported === true && typeof result.confidence === 'number' &&
    result.confidence >= 0.8 && result.confidence <= 1 && item?.name === result.itemName
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
      (rule.validUntil !== null && rule.validUntil !== undefined &&
        (!validDate(rule.validUntil) || rule.validUntil <= rule.validFrom))) {
      throw new TypeError('Published rule has invalid effective dates.')
    }
    return rule.validFrom <= date && (!rule.validUntil || date < rule.validUntil)
  })
  if (active.length > 1) return { status: 'CONFLICT' }
  if (active.length === 0) return { status: 'UNKNOWN' }
  return { status: 'MATCHED', rule: active[0] }
}

export function selectActiveConflicts(conflicts, date) {
  const active = conflicts.filter((conflict) => {
    if (!conflict || !validDate(conflict.validFrom) ||
      (conflict.validUntil !== null && conflict.validUntil !== undefined &&
        (!validDate(conflict.validUntil) || conflict.validUntil <= conflict.validFrom))) {
      throw new TypeError('Published conflict has invalid effective dates.')
    }
    return conflict.validFrom <= date && (!conflict.validUntil || date < conflict.validUntil)
  })
  if (!active.length) return null
  return {
    status: 'CONFLICT',
    message: 'A reviewer has recorded an unresolved source disagreement. WhatBin cannot determine a disposal route.',
    conflicts: active.map((conflict) => {
      if (!validText(conflict.summary, 1000) || !Array.isArray(conflict.claims) || conflict.claims.length < 2 ||
        conflict.claims.some((claim) => !validText(claim?.sourceTitle, 500) || !isHttpUrl(claim.sourceUrl) ||
          !validText(claim.sourceVersion, 500) || !validText(claim.citation, 500) || !validText(claim.claim, 5000))) {
        throw new TypeError('Published conflict has invalid content.')
      }
      return {
        summary: conflict.summary,
        validFrom: conflict.validFrom,
        validUntil: conflict.validUntil ?? null,
        claims: conflict.claims.map(({sourceTitle, sourceUrl, sourceVersion, citation, claim}) =>
          ({sourceTitle, sourceUrl, sourceVersion, citation, claim})),
      }
    }),
  }
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
    ['disposal', 'currentness', 'agency-logistics'].includes(entry.claimType) &&
    sourceReferences.some((reference) => sameSource(reference, {
      title: entry.sourceTitle, url: entry.sourceUrl, citation: entry.sourceCitation,
    })) &&
    Array.isArray(entry.requires) && entry.requires.length > 0 &&
    entry.requires.every((required) => sourceReferences.some((reference) => sameSource(reference, required))),
  ).map(({ sourceTitle, sourceUrl, sourceCitation, sourceVersion, citation, text, requires, claimType }) =>
    ({ sourceTitle, sourceUrl, sourceCitation, sourceVersion, citation, text, requires, claimType }))
}

async function publishedContent(input) {
  const query = '*[_type in ["disposalRule","disposalConflict"] && !(_id in path("drafts.**")) && jurisdiction == $jurisdiction && canonicalItemId == $canonicalItemId]{_type,canonicalItemId,itemName,disposalCategory,instruction,validFrom,validUntil,sourceReferences,supportingPassages,summary,claims}'
  const params = new URLSearchParams({
    query,
    perspective: 'published',
    '$jurisdiction': JSON.stringify(input.jurisdiction),
    '$canonicalItemId': JSON.stringify(input.canonicalItemId),
  })
  const response = await fetch(`${SANITY_URL}?${params}`, {signal: AbortSignal.timeout(10000), headers: {accept: 'application/json'}})
  if (!response.ok) throw Object.assign(new Error('Published content service is unavailable.'), {status: 502})
  let payload
  try { payload = await response.json() } catch { throw Object.assign(new Error('Published content service returned invalid data.'), {status: 502}) }
  if (!Array.isArray(payload?.result)) throw Object.assign(new Error('Published content service returned invalid data.'), {status: 502})
  return {
    rules: payload.result.filter((document) => document?._type !== 'disposalConflict'),
    conflicts: payload.result.filter((document) => document?._type === 'disposalConflict'),
  }
}

async function resolveRule(input) {
  const {rules, conflicts} = await publishedContent(input)
  const today = localDate(JURISDICTIONS[input.jurisdiction])
  let selection
  try {
    const sourceConflict = selectActiveConflicts(conflicts, today)
    selection = sourceConflict ?? selectActiveRule(rules, today)
  } catch {
    throw Object.assign(new Error('Published content has invalid effective dates or content.'), {status: 502})
  }
  if (selection.status !== 'MATCHED') return {...selection, asOf: today}
  const rule = selection.rule
  if (![rule.canonicalItemId, rule.itemName, rule.disposalCategory, rule.instruction].every((value) => validText(value, 5000)) ||
    !Array.isArray(rule.sourceReferences) || !rule.sourceReferences.length || rule.sourceReferences.some((source) =>
      !validText(source?.title, 500) || !validText(source?.citation, 500) || !isHttpUrl(source?.url))) {
    throw Object.assign(new Error('Published rule has invalid content.'), {status: 502})
  }
  return {status: 'MATCHED', asOf: today, itemName: rule.itemName, category: rule.disposalCategory,
    instruction: rule.instruction, validFrom: rule.validFrom, validUntil: rule.validUntil ?? null,
    sourceReferences: rule.sourceReferences, supportingPassages: matchSupportingPassages(rule.sourceReferences, rule.supportingPassages)}
}

function allowedStudioOrigins() {
  const configured = process.env.SANITY_STUDIO_ORIGINS
  if (configured !== undefined) return new Set(configured.split(',').map((origin) => origin.trim()).filter(Boolean))
  return new Set(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3333'])
}

function researchCors(req, res) {
  const origin = req.headers.origin
  if (typeof origin !== 'string' || !allowedStudioOrigins().has(origin)) return false
  res.setHeader('access-control-allow-origin', origin)
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS')
  res.setHeader('access-control-allow-headers', 'Authorization, Content-Type')
  res.setHeader('vary', 'Origin')
  return true
}

async function authorizeStudio(req) {
  const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization ?? '')
  if (!match) return false
  const response = await fetch(SANITY_ACCESS_URL, {
    headers: { authorization: `Bearer ${match[1]}`, accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  })
  return response.ok
}

function overlapsPublished(candidate, rules) {
  return rules.some((rule) =>
    (!rule.validUntil || candidate.validFrom < rule.validUntil) &&
    (!candidate.validUntil || rule.validFrom < candidate.validUntil))
}

async function researchRule(input) {
  const {rules, conflicts} = await publishedContent(input)
  const today = localDate(JURISDICTIONS[input.jurisdiction])
  let selection
  try {
    if (selectActiveConflicts(conflicts, today)) {
      return {status: 'GAP', reason: 'A published reviewer-recorded conflict is active for the current date.'}
    }
    selection = selectActiveRule(rules, today)
  } catch {
    throw Object.assign(new Error('Published content has invalid effective dates or content.'), {status: 502})
  }
  if (selection.status === 'MATCHED' || selection.status === 'CONFLICT') return {status: 'GAP', reason: 'A published rule already covers the current date.'}
  const result = await researchSource(input)
  if (result?.status !== 'PREVIEW') return result?.status === 'GAP' ? result : {status: 'GAP', reason: 'The sources could not be verified.'}
  if (overlapsPublished(result, rules) || overlapsPublished(result, conflicts)) {
    return {status: 'GAP', reason: 'The proposed effective period overlaps published content.'}
  }
  const {status, ...candidate} = result
  return {status: 'PREVIEW', candidate}
}


async function explainRule(input) {
  requireContextAgentConfiguration()
  const jurisdictions = [input.jurisdiction, input.jurisdiction === 'hanoi' ? 'ho-chi-minh-city' : 'hanoi']
  const outcomes = await Promise.all(jurisdictions.map(async (jurisdiction) => ({
    jurisdiction,
    date: localDate(JURISDICTIONS[jurisdiction]),
    ...await resolveRule({canonicalItemId: input.canonicalItemId, jurisdiction}),
  })))
  return outcomes.every((outcome) => outcome.status === 'MATCHED') ? outcomes : [outcomes[0]]
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
      if (url.pathname === '/api/research-source') {
        if (!researchCors(req, res)) { send(res, 403, { error: 'Origin is not allowed.' }); return }
        if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
        if (req.method !== 'POST') { send(res, 405, { error: 'Method not allowed.' }); return }
        if (!await authorizeStudio(req)) { send(res, 401, { error: 'Studio authorization is required.' }); return }
        const input = await bodyJson(req)
        if (!ITEM_NAMES.has(input.canonicalItemId) || !Object.hasOwn(JURISDICTIONS, input.jurisdiction) ||
          (input.canonicalItemId === 'used-mobile-phone' && input.jurisdiction !== 'hanoi') ||
          Object.keys(input).some((key) => !['canonicalItemId', 'jurisdiction'].includes(key))) {
          send(res, 400, { error: 'A valid canonical item ID and jurisdiction are required.' }); return
        }
        send(res, 200, await researchRule(input)); return
      }
      if (url.pathname === '/api/items') {
        if (req.method !== 'GET') { send(res, 405, { error: 'Method not allowed.' }); return }
        send(res, 200, { items: [...ITEM_NAMES].map(([canonicalItemId, itemName]) => ({ canonicalItemId, itemName })) })
        return
      }
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
      if (url.pathname === '/api/explain') {
        if (req.method !== 'POST') { send(res, 405, {error: 'Method not allowed.'}); return }
        const input = await bodyJson(req)
        const history = input.history === undefined ? [] : input.history
        if (!Object.hasOwn(JURISDICTIONS, input.jurisdiction) ||
          !validText(input.canonicalItemId, 100) || input.canonicalItemId.length > 100 ||
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.canonicalItemId) ||
          !validText(input.question, 1200) || input.question.length > 1200 ||
          !validConversationHistory(history) || input.confirmed !== true ||
          Object.keys(input).some((key) => !['canonicalItemId', 'jurisdiction', 'question', 'history', 'confirmed'].includes(key))) {
          send(res, 400, {error: 'A confirmed item result and valid question are required.'}); return
        }
        const outcomes = await explainRule({...input, history})
        const disconnect = new AbortController()
        const abortOnDisconnect = () => {
          if (!res.writableEnded) disconnect.abort()
        }
        res.once('close', abortOnDisconnect)
        let agent
        try {
          agent = await startExplanationStream({
            question: input.question,
            history,
            outcomes,
            abortSignal: AbortSignal.any([AbortSignal.timeout(45000), disconnect.signal]),
          })
          res.writeHead(200, {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'no-cache, no-transform',
            'x-content-type-options': 'nosniff',
          })
          let emitted = false
          let failed = false
          try {
            for await (const chunk of agent.result.textStream) {
              if (!chunk) continue
              emitted = true
              if (!res.write(chunk)) await once(res, 'drain')
            }
          } catch {
            failed = true
          }
          if (!res.destroyed) {
            if (!emitted || failed) {
              if (emitted) res.write('\n\n')
              res.end("I couldn't verify an explanation from Sanity Context. The displayed WhatBin result remains authoritative.")
            } else res.end()
          }
        } finally {
          res.off('close', abortOnDisconnect)
          await agent?.close()
        }
        return
      }
      if (url.pathname.startsWith('/api/')) { send(res, 404, { error: 'Not found.' }); return }
      if (req.method !== 'GET' && req.method !== 'HEAD') { send(res, 405, { error: 'Method not allowed.' }); return }
      await serveStatic(req, res, url.pathname)
    } catch (error) {
      if (!res.headersSent) send(res, error.status ?? 502, { error: error.status ? error.message : 'The service could not complete the request.' })
    }
  })
}


