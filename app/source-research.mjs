const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions'
const ITEMS = new Map([
  ['old-mattress', 'Old mattress'],
  ['used-household-battery', 'Used household battery'],
  ['used-lithium-ion-battery', 'Used rechargeable lithium-ion battery'],
  ['used-mobile-phone', 'Used mobile phone'],
  ['used-fluorescent-lamp', 'Used fluorescent lamp'],
  ['used-mercury-thermometer', 'Used mercury thermometer'],
  ['cooked-food-scrap', 'Cooked food scrap'],
  ['fruit-vegetable-peel', 'Raw fruit and vegetable peel'],
  ['fallen-leaves-garden-waste', 'Fallen leaves and garden waste'],
  ['discarded-coconut-shell', 'Discarded coconut shell'],
  ['large-animal-bone', 'Large animal bone'],
  ['pet-plastic-bottle', 'PET plastic beverage bottle'],
  ['corrugated-cardboard-box', 'Corrugated cardboard box'],
  ['aluminum-beverage-can', 'Aluminum beverage can'],
  ['glass-bottle-jar', 'Glass bottle or jar'],
  ['expired-household-medicine', 'Expired household medicine'],
  ['used-cooking-oil', 'Used cooking oil'],
  ['aerosol-spray-can', 'Aerosol spray can'],
  ['household-pesticide-container', 'Household pesticide container'],
  ['discarded-wooden-furniture', 'Discarded wooden furniture'],
  ['discarded-upholstered-sofa', 'Discarded upholstered sofa'],
  ['discarded-electric-fan', 'Discarded electric fan'],
  ['discarded-laptop', 'Discarded laptop computer'],
  ['discarded-microwave-oven', 'Discarded microwave oven'],
  ['discarded-charging-cable', 'Discarded charging cable'],
  ['disposable-baby-diaper', 'Disposable baby diaper'],
  ['broken-ceramic-tableware', 'Broken ceramic dish or shards'],
  ['multi-layer-snack-packaging', 'Multi-layer snack packaging'],
  ['used-motor-oil', 'Used motorbike engine motor oil'],
  ['used-lead-acid-accumulator', 'Discarded motorbike lead-acid battery'],
  ['used-motorbike-tire', 'Used motorbike tires and inner tubes'],
  ['discarded-motorbike-helmet', 'Discarded motorbike helmet'],
  ['beverage-carton-tetra-pak', 'Aseptic multi-layer beverage carton'],
  ['polystyrene-foam-box', 'Expanded polystyrene foam box'],
  ['single-use-plastic-bag', 'Single-use plastic carrier bag'],
  ['plastic-bubble-wrap', 'Plastic bubble wrap packaging'],
  ['renovation-rubble-tiles', 'Minor home renovation rubble and tiles'],
  ['discarded-ceramic-toilet-sink', 'Discarded ceramic toilet or sink'],
  ['used-clothing-textile', 'Wearable second-hand clothing'],
  ['worn-out-footwear', 'Old worn-out shoes and footwear'],
  ['used-medical-mask', 'Used disposable medical mask'],
  ['household-medical-sharps', 'Household medical sharps and needles'],
  ['discarded-nail-polish-bottle', 'Nail polish and solvent bottle'],
  ['leftover-paint-can', 'Leftover household paint can'],
  ['incense-joss-paper-ash', 'Incense ash and joss paper ash'],
  ['coffee-grounds-tea-leaves', 'Coffee grounds and loose tea leaves'],
])
const ROLES = new Set(['binding-rule', 'agency-clarification', 'currentness-record'])
const CLAIM_TYPE_BY_ROLE = new Map([
  ['binding-rule', 'disposal'],
  ['currentness-record', 'currentness'],
  ['agency-clarification', 'agency-logistics'],
])
const LEGAL_HOSTS = new Set(['vbpl.vn', 'vanban.chinhphu.vn', 'congbao.chinhphu.vn'])

function text(value, max = 5000) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max
}

function officialUrl(value) {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    return url.protocol === 'https:' && (host === 'gov.vn' || host.endsWith('.gov.vn') || LEGAL_HOSTS.has(host))
  } catch { return false }
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function gap(reason) {
  return { status: 'GAP', reason }
}

function matchingCandidate(value, groundedUrls, expected) {
  if (!value || value.status !== 'PREVIEW' || value.canonicalItemId !== expected.canonicalItemId ||
    value.itemName !== ITEMS.get(expected.canonicalItemId) || value.jurisdiction !== expected.jurisdiction ||
    !text(value.disposalCategory, 500) || !text(value.instruction) || !validDate(value.validFrom) ||
    !(value.validUntil === null || value.validUntil === undefined || validDate(value.validUntil)) ||
    (value.validUntil && value.validUntil <= value.validFrom) || !Array.isArray(value.sourceReferences) ||
    !Array.isArray(value.supportingPassages)) return null

  const refs = value.sourceReferences
  if (refs.some((ref) => !ROLES.has(ref?.sourceRole) || !text(ref.title, 500) || !text(ref.citation, 500) ||
    !officialUrl(ref.url) || !groundedUrls.has(ref.url))) return null
  if (!refs.some((ref) => ref.sourceRole === 'binding-rule') || !refs.some((ref) => ref.sourceRole === 'currentness-record') ||
    !value.supportingPassages.length) return null
  const sameReference = (ref, source) => ref.title === source.title && ref.url === source.url && ref.citation === source.citation
  const passages = value.supportingPassages
  if (passages.some((passage) => !text(passage.sourceTitle, 500) || !officialUrl(passage.sourceUrl) ||
    !groundedUrls.has(passage.sourceUrl) || !text(passage.sourceCitation, 500) || !text(passage.sourceVersion, 500) ||
    !text(passage.citation, 500) || !text(passage.text) || CLAIM_TYPE_BY_ROLE.get(refs.find((ref) =>
      sameReference(ref, { title: passage.sourceTitle, url: passage.sourceUrl, citation: passage.sourceCitation,
      }))?.sourceRole) !== passage.claimType ||
    !Array.isArray(passage.requires) || passage.requires.length === 0 || passage.requires.some((required) =>
      !refs.some((ref) => sameReference(ref, required))))) return null
  if (refs.some((ref) => !passages.some((passage) => passage.sourceTitle === ref.title &&
    passage.sourceUrl === ref.url && passage.sourceCitation === ref.citation))) return null
  if (!passages.some((passage) => refs.some((ref) => ref.sourceRole === 'binding-rule' && sameReference(ref, {
    title: passage.sourceTitle, url: passage.sourceUrl, citation: passage.sourceCitation,
  })) && passage.claimType === 'disposal')) return null
  if (!passages.some((passage) => refs.some((ref) => ref.sourceRole === 'currentness-record' && sameReference(ref, {
    title: passage.sourceTitle, url: passage.sourceUrl, citation: passage.sourceCitation,
  })) && passage.claimType === 'currentness')) return null
  return {
    status: 'PREVIEW', canonicalItemId: value.canonicalItemId, itemName: value.itemName,
    jurisdiction: value.jurisdiction, disposalCategory: value.disposalCategory, instruction: value.instruction,
    validFrom: value.validFrom, validUntil: value.validUntil ?? null,
    sourceReferences: refs.map(({ title, url, citation, sourceRole }) => ({ title, url, citation, sourceRole })),
    supportingPassages: passages.map(({ sourceTitle, sourceUrl, sourceCitation, sourceVersion, citation, text: passageText, requires, claimType }) => ({
      sourceTitle, sourceUrl, sourceCitation, sourceVersion, citation, text: passageText,
      requires: requires.map(({ title, url, citation }) => ({ title, url, citation })), claimType,
    })),
  }
}

function outputBlocks(envelope) {
  return (envelope?.steps ?? []).filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content ?? []).filter((block) => block.type === 'text')
}

export async function researchSource(input, { fetchImpl = fetch } = {}) {
  const key = process.env.GEMINI_API_KEY
  if (input.canonicalItemId === 'used-mobile-phone' && input.jurisdiction !== 'hanoi') return gap('Source research is not available for this jurisdiction.')
  const prompt = `Research a disposal rule for canonical item ${input.canonicalItemId} (${ITEMS.get(input.canonicalItemId)}) in ${input.jurisdiction}. Cite current official Vietnamese legal/government sources only. Verify that the binding instrument is currently in force, including amendments and repeals, and cite official currentness evidence. If status is unclear or sources conflict, return status GAP with a brief reason. Never infer. Return one JSON object: status; for PREVIEW include canonicalItemId, itemName, jurisdiction, disposalCategory, instruction, validFrom, validUntil, sourceReferences and supportingPassages. Each source reference requires exact title/url/citation and role binding-rule, agency-clarification, or currentness-record. Each passage requires exact matching sourceTitle, sourceUrl, sourceCitation, sourceVersion, citation, text, requires and claimType. Do not add facts unsupported by the sources.${input.canonicalItemId === 'used-mobile-phone' ? ' Research Hanoi only. Treat a discarded whole mobile phone as distinct from accessories, installed batteries, standalone batteries, and complete power banks. Base the preview on Hanoi Decision 87 attachment Articles 5(1)(h) and 7(2)(a), and Article 7(1)(a) for urban collection being subject to commune directions. Preserve the provenance caveat: the attachment has blank internal number, date, and effective-date fields; use official Hanoi portal metadata for final Decision number, signer, issuance and effective dates, and official legal-status evidence for in-force status. Do not infer a Ho Chi Minh City phone rule.' : ''}`
  const response = await fetchImpl(INTERACTIONS_URL, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, signal: AbortSignal.timeout(30000),
    body: JSON.stringify({ model: 'gemini-3.8-flash', input: prompt, tools: [{ type: 'google_search' }, { type: 'url_context' }] }),
  })
  if (!response.ok) throw Object.assign(new Error('Source research provider request failed.'), { status: 502 })
  let envelope
  try { envelope = await response.json() } catch { throw Object.assign(new Error('Source research provider returned invalid data.'), { status: 502 }) }
  const blocks = outputBlocks(envelope)
  const raw = blocks.map((block) => block.text ?? '').join('\n')
  let candidate
  try { candidate = JSON.parse(raw) } catch { return gap('The sources could not be verified.') }
  if (candidate?.status === 'GAP') return gap(text(candidate.reason, 1000) ? candidate.reason.trim() : 'The sources could not be verified.')
  const citations = blocks.flatMap((block) => (block.annotations ?? []).filter((annotation) => annotation.type === 'url_citation' &&
    typeof annotation.url === 'string' && Number.isInteger(annotation.start_index) && Number.isInteger(annotation.end_index) &&
    annotation.start_index >= 0 && annotation.end_index > annotation.start_index).map((annotation) => ({
      url: annotation.url, attributedText: block.text.slice(annotation.start_index, annotation.end_index),
    })))
  const groundedUrls = new Set(citations.filter((citation) => officialUrl(citation.url) && text(citation.attributedText)).map(({ url }) => url))
  const validated = matchingCandidate(candidate, groundedUrls, input)
  return validated ?? gap('Official currentness or claim-linked source evidence could not be verified.')
}
