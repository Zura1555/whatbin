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
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_DEFAULT_MODEL = 'gemini-3.1-flash-lite'
function geminiUrl() {
  const model = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL
  return `${GEMINI_BASE_URL}/${model}:generateContent`
}
const OPENROUTER_COMPLETIONS_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_DECISIONS_URL = 'https://openrouter.ai/api/alpha/decisions'
const CLEF_FLASH_RUN_PATH = '@cf/cloudflare/clef-flash'
const CLEF_RUN_PATH = '@cf/cloudflare/clef'
const RECOGNITION_CONFIDENCE_THRESHOLD = 0.8

function cloudflareClefRunUrl(accountId, variant) {
  const path = variant === 'clef' ? CLEF_RUN_PATH : CLEF_FLASH_RUN_PATH
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${path}`
}

function cloudflareClefCredentials() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
  const token = (process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_AUTH_TOKEN)?.trim()
  if (!accountId || !token) return null
  return { accountId, token }
}
const RECOGNITION_CATEGORIES = new Map([
  ['old-mattress', {name: 'Old mattress', criteria: 'An old or used household mattress being discarded.'}],
  ['used-household-battery', {name: 'Used household battery', criteria: 'A clearly identified discarded, intact household-size AA or AAA cell.'}],
  ['used-lithium-ion-battery', {name: 'Used rechargeable lithium-ion battery', criteria: 'A discarded rechargeable lithium-ion cell or standalone battery pack that is not installed in a device and is not a complete power bank.'}],
  ['used-mobile-phone', {name: 'Used mobile phone', criteria: 'A discarded whole mobile phone as one household electronic item, not an accessory or separate battery.'}],
  ['used-power-bank', {name: 'Used power bank', criteria: 'A complete discarded power bank as a whole item, not a standalone battery.'}],
  ['used-fluorescent-lamp', {name: 'Used fluorescent lamp', criteria: 'A clearly identified discarded household fluorescent tube or compact fluorescent bulb, whether intact or broken.'}],
  ['used-mercury-thermometer', {name: 'Used mercury thermometer', criteria: 'A clearly identified discarded household mercury thermometer, not a digital or other non-mercury thermometer.'}],
  ['cooked-food-scrap', {name: 'Cooked food scrap', criteria: 'Discarded cooked meal leftovers, rice, noodles, or soft food scraps, not raw animal carcasses or large hard bones.'}],
  ['fruit-vegetable-peel', {name: 'Raw fruit and vegetable peel', criteria: 'Discarded soft peels, stems, and trimmings from raw fruits and vegetables, not coconut shells or durian husks.'}],
  ['fallen-leaves-garden-waste', {name: 'Fallen leaves and garden waste', criteria: 'Small quantities of swept fallen leaves, wilted plant foliage, or tender garden trimmings, not large tree branches or trunks.'}],
  ['discarded-coconut-shell', {name: 'Discarded coconut shell', criteria: 'A discarded whole, halved, or chopped hard coconut shell or husk, not soft coconut meat or general fruit peel.'}],
  ['large-animal-bone', {name: 'Large animal bone', criteria: 'A discarded large, hard animal bone such as cattle, pig, or goat soup bones, not small soft poultry or fish bones.'}],
  ['pet-plastic-bottle', {name: 'PET plastic beverage bottle', criteria: 'A discarded transparent or lightly tinted polyethylene terephthalate (PET) plastic bottle used for beverages or cooking oil, not opaque HDPE or PVC bottles.'}],
  ['corrugated-cardboard-box', {name: 'Corrugated cardboard box', criteria: 'A clean, dry discarded corrugated cardboard shipping or parcel delivery box, not greasy or wax-coated paperboard.'}],
  ['aluminum-beverage-can', {name: 'Aluminum beverage can', criteria: 'A discarded empty aluminum can used for beer, soda, or other beverages, not a pressurized aerosol spray can.'}],
  ['glass-bottle-jar', {name: 'Glass bottle or jar', criteria: 'A discarded empty glass beverage bottle or food condiment jar, not broken window glass, mirrors, or ceramic tableware.'}],
  ['expired-household-medicine', {name: 'Expired household medicine', criteria: 'Discarded expired or unused prescription or over-the-counter medicine in pill, liquid, or ointment form, not empty packaging or sharps.'}],
  ['used-cooking-oil', {name: 'Used cooking oil', criteria: 'Discarded spent cooking oil or frying grease from domestic food preparation, not engine or motor oil.'}],
  ['aerosol-spray-can', {name: 'Aerosol spray can', criteria: 'A discarded pressurized metal canister with a spray valve such as hairspray, deodorant, or spray paint, not an unpressurized beverage can.'}],
  ['household-pesticide-container', {name: 'Household pesticide container', criteria: 'A discarded bottle, spray, or can that contained household insecticides, mosquito sprays, or pest poison, not regular detergent bottles.'}],
  ['discarded-wooden-furniture', {name: 'Discarded wooden furniture', criteria: 'A large discarded household wooden item such as a wardrobe, table, chair, desk, or bed frame, not small wooden utensils.'}],
  ['discarded-upholstered-sofa', {name: 'Discarded upholstered sofa', criteria: 'A discarded sofa, couch, or upholstered armchair, not a compact office chair or loose cushion.'}],
  ['discarded-electric-fan', {name: 'Discarded electric fan', criteria: 'A discarded standing, desk, wall, or ceiling electric fan, not a handheld mini battery fan.'}],
  ['discarded-laptop', {name: 'Discarded laptop computer', criteria: 'A complete discarded laptop or notebook computer with screen and keyboard, not a standalone battery or computer monitor.'}],
  ['discarded-microwave-oven', {name: 'Discarded microwave oven', criteria: 'A discarded countertop microwave or toaster oven, not an industrial oven or standalone induction plate.'}],
  ['discarded-charging-cable', {name: 'Discarded charging cable', criteria: 'A discarded phone charging cable, USB cord, power cord, or wall charging brick, not a phone or power bank.'}],
  ['disposable-baby-diaper', {name: 'Disposable baby diaper', criteria: 'A used single-use baby diaper, adult incontinence pad, or sanitary napkin, not cloth diapers.'}],
  ['broken-ceramic-tableware', {name: 'Broken ceramic dish or shards', criteria: 'Broken pieces or shards of ceramic, porcelain bowls, plates, or mugs, not recyclable glass bottles or jars.'}],
  ['multi-layer-snack-packaging', {name: 'Multi-layer snack packaging', criteria: 'A discarded flexible plastic foil snack bag or noodle wrapper with a shiny metallic interior lining, not clean transparent plastic bags.'}],
  ['used-motor-oil', {name: 'Used motorbike engine motor oil', criteria: 'Spent, dark viscous hydrocarbon motor oil drained from a motorcycle engine, not cooking oil or clean oil.'}],
  ['used-lead-acid-accumulator', {name: 'Discarded motorbike lead-acid battery', criteria: 'A discarded 12V lead-acid motorcycle battery or accumulator with exposed terminals, not a small cylindrical battery or lithium-ion pack.'}],
  ['used-motorbike-tire', {name: 'Used motorbike tires and inner tubes', criteria: 'A discarded worn rubber motorcycle tire or punctured inner tube, not bicycle tires or footwear soles.'}],
  ['discarded-motorbike-helmet', {name: 'Discarded motorbike helmet', criteria: 'A damaged or expired protective motorcycle helmet with outer hard shell and bonded foam liner, not an industrial hard hat or bicycle helmet.'}],
  ['beverage-carton-tetra-pak', {name: 'Aseptic multi-layer beverage carton', criteria: 'A multi-layer aseptic paper, plastic, and aluminum beverage or milk carton (such as Tetra Pak), not a corrugated shipping box or plain paper cup.'}],
  ['polystyrene-foam-box', {name: 'Expanded polystyrene foam box', criteria: 'A white lightweight expanded polystyrene (EPS) clamshell takeout food box or cooler transport box, not flexible bubble wrap.'}],
  ['single-use-plastic-bag', {name: 'Single-use plastic carrier bag', criteria: 'An ultra-thin, lightweight single-use polyethylene plastic carrier bag or market film, not a thick reusable shopping bag.'}],
  ['plastic-bubble-wrap', {name: 'Plastic bubble wrap packaging', criteria: 'Flexible plastic cushioning film with air-filled bubbles used for parcel packaging, not rigid foam boxes or cling wrap.'}],
  ['renovation-rubble-tiles', {name: 'Minor home renovation rubble and tiles', criteria: 'Dense mineral debris, shattered bricks, concrete chunks, or broken ceramic floor and wall tiles from home repairs, not dining tableware.'}],
  ['discarded-ceramic-toilet-sink', {name: 'Discarded ceramic toilet or sink', criteria: 'A discarded vitreous china or porcelain toilet bowl, cistern, or bathroom washbasin, not a stainless steel sink or dining dish.'}],
  ['used-clothing-textile', {name: 'Wearable second-hand clothing', criteria: 'Clean wearable used garments, shirts, pants, or dresses suitable for donation or reuse, not oil-soaked rags or mattresses.'}],
  ['worn-out-footwear', {name: 'Old worn-out shoes and footwear', criteria: 'Torn, broken, or unwearable shoes, disintegrated foam sandals, or sneakers, not wearable shoes or rubber tires.'}],
  ['used-medical-mask', {name: 'Used disposable medical mask', criteria: 'A used single-use 3-ply or 4-ply pleated surgical or medical face mask with ear loops, not a reusable cloth mask.'}],
  ['household-medical-sharps', {name: 'Household medical sharps and needles', criteria: 'Discarded diabetic lancets, insulin pen needles, or syringes used for domestic medical care, not sewing needles or utility blades.'}],
  ['discarded-nail-polish-bottle', {name: 'Nail polish and solvent bottle', criteria: 'A small bottle containing nail polish enamel, lacquer, or acetone solvent remover with an applicator cap, not regular beverage glass.'}],
  ['leftover-paint-can', {name: 'Leftover household paint can', criteria: 'A metal can or plastic bucket containing liquid or cured architectural wall paint, not an aerosol spray can.'}],
  ['incense-joss-paper-ash', {name: 'Incense ash and joss paper ash', criteria: 'Cold, fully extinguished ash from burnt ancestral altar incense sticks or votive spirit paper, not hot embers or charcoal slag.'}],
  ['coffee-grounds-tea-leaves', {name: 'Coffee grounds and loose tea leaves', criteria: 'Spent brewed coffee grounds from drip filters or loose steeped tea leaves, not synthetic plastic tea bags.'}],
])
const ITEM_NAMES = new Map([
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
  const clefCredentials = cloudflareClefCredentials()
  const openRouterKey = process.env.OPENROUTER_API_KEY
  const key = process.env.GEMINI_API_KEY
  if (!clefCredentials && !openRouterKey && !key) {
    throw Object.assign(new Error('Recognition is unavailable: configure CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN, GEMINI_API_KEY, or OPENROUTER_API_KEY.'), { status: 503 })
  }
  const image = input.image
  const description = validText(input.description, 4000) ? input.description.trim() : null
  if (clefCredentials) {
    const result = await recognizeWithClef(clefCredentials, description, image)
    return recognitionResponse(result)
  }
  const prompt = `Identify a household item${image && description ? ` using the attached image and this description: ${description}` : image ? ' from the attached image' : ` from this description: ${description}`}. The only supported items are canonicalItemId "old-mattress", itemName "Old mattress" (an old or used household mattress being discarded); canonicalItemId "used-household-battery", itemName "Used household battery" (a clearly identified discarded, intact household-size AA or AAA cell); canonicalItemId "used-lithium-ion-battery", itemName "Used rechargeable lithium-ion battery" (a clearly identified discarded rechargeable lithium-ion cell or battery pack that is not installed in a device; do not use this category for batteries still installed in devices, whole devices including power banks, other battery chemistries, chargers, or uncertain items); canonicalItemId "used-power-bank", itemName "Used power bank" (a clearly identified complete discarded portable power bank as a whole item; never identify a whole power bank as a standalone battery); canonicalItemId "used-mobile-phone", itemName "Used mobile phone" (a clearly identified discarded whole mobile phone as one household electronic item; do not use for phone accessories, standalone batteries, batteries installed in a device as separate items, or complete power banks); canonicalItemId "used-fluorescent-lamp", itemName "Used fluorescent lamp" (a clearly identified discarded fluorescent tube or compact fluorescent bulb, whether intact or broken); canonicalItemId "used-mercury-thermometer", itemName "Used mercury thermometer" (a clearly identified discarded mercury thermometer); canonicalItemId "cooked-food-scrap", itemName "Cooked food scrap" (discarded cooked meal leftovers, rice, noodles, or soft food scraps, not raw animal carcasses or large hard bones); canonicalItemId "fruit-vegetable-peel", itemName "Raw fruit and vegetable peel" (discarded soft peels, stems, and trimmings from raw fruits and vegetables, not coconut shells or durian husks); canonicalItemId "fallen-leaves-garden-waste", itemName "Fallen leaves and garden waste" (small quantities of swept fallen leaves, wilted plant foliage, or tender garden trimmings, not large tree branches or trunks); canonicalItemId "discarded-coconut-shell", itemName "Discarded coconut shell" (a discarded whole, halved, or chopped hard coconut shell or husk, not soft coconut meat or general fruit peel); canonicalItemId "large-animal-bone", itemName "Large animal bone" (a discarded large, hard animal bone such as cattle, pig, or goat soup bones, not small soft poultry or fish bones); canonicalItemId "pet-plastic-bottle", itemName "PET plastic beverage bottle" (a discarded transparent or lightly tinted polyethylene terephthalate (PET) plastic bottle used for beverages or cooking oil, not opaque HDPE or PVC bottles); canonicalItemId "corrugated-cardboard-box", itemName "Corrugated cardboard box" (a clean, dry discarded corrugated cardboard shipping or parcel delivery box, not greasy or wax-coated paperboard); canonicalItemId "aluminum-beverage-can", itemName "Aluminum beverage can" (a discarded empty aluminum can used for beer, soda, or other beverages, not a pressurized aerosol spray can); canonicalItemId "glass-bottle-jar", itemName "Glass bottle or jar" (a discarded empty glass beverage bottle or food condiment jar, not broken window glass, mirrors, or ceramic tableware); canonicalItemId "expired-household-medicine", itemName "Expired household medicine" (discarded expired or unused prescription or over-the-counter medicine in pill, liquid, or ointment form, not empty packaging or sharps); canonicalItemId "used-cooking-oil", itemName "Used cooking oil" (discarded spent cooking oil or frying grease from domestic food preparation, not engine or motor oil); canonicalItemId "aerosol-spray-can", itemName "Aerosol spray can" (a discarded pressurized metal canister with a spray valve such as hairspray, deodorant, or spray paint, not an unpressurized beverage can); canonicalItemId "household-pesticide-container", itemName "Household pesticide container" (a discarded bottle, spray, or can that contained household insecticides, mosquito sprays, or pest poison, not regular detergent bottles); canonicalItemId "discarded-wooden-furniture", itemName "Discarded wooden furniture" (a large discarded household wooden item such as a wardrobe, table, chair, desk, or bed frame, not small wooden utensils); canonicalItemId "discarded-upholstered-sofa", itemName "Discarded upholstered sofa" (a discarded sofa, couch, or upholstered armchair, not a compact office chair or loose cushion); canonicalItemId "discarded-electric-fan", itemName "Discarded electric fan" (a discarded standing, desk, wall, or ceiling electric fan, not a handheld mini battery fan); canonicalItemId "discarded-laptop", itemName "Discarded laptop computer" (a complete discarded laptop or notebook computer with screen and keyboard, not a standalone battery or computer monitor); canonicalItemId "discarded-microwave-oven", itemName "Discarded microwave oven" (a discarded countertop microwave or toaster oven, not an industrial oven or standalone induction plate); canonicalItemId "discarded-charging-cable", itemName "Discarded charging cable" (a discarded phone charging cable, USB cord, power cord, or wall charging brick, not a phone or power bank); canonicalItemId "disposable-baby-diaper", itemName "Disposable baby diaper" (a used single-use baby diaper, adult incontinence pad, or sanitary napkin, not cloth diapers); canonicalItemId "broken-ceramic-tableware", itemName "Broken ceramic dish or shards" (broken pieces or shards of ceramic, porcelain bowls, plates, or mugs, not recyclable glass bottles or jars); canonicalItemId "multi-layer-snack-packaging", itemName "Multi-layer snack packaging" (a discarded flexible plastic foil snack bag or noodle wrapper with a shiny metallic interior lining, not clean transparent plastic bags); canonicalItemId "used-motor-oil", itemName "Used motorbike engine motor oil" (spent, dark viscous hydrocarbon motor oil drained from a motorcycle engine, not cooking oil or clean oil); canonicalItemId "used-lead-acid-accumulator", itemName "Discarded motorbike lead-acid battery" (a discarded 12V lead-acid motorcycle battery or accumulator with exposed terminals, not a small cylindrical battery or lithium-ion pack); canonicalItemId "used-motorbike-tire", itemName "Used motorbike tires and inner tubes" (a discarded worn rubber motorcycle tire or punctured inner tube, not bicycle tires or footwear soles); canonicalItemId "discarded-motorbike-helmet", itemName "Discarded motorbike helmet" (a damaged or expired protective motorcycle helmet with outer hard shell and bonded foam liner, not an industrial hard hat or bicycle helmet); canonicalItemId "beverage-carton-tetra-pak", itemName "Aseptic multi-layer beverage carton" (a multi-layer aseptic paper, plastic, and aluminum beverage or milk carton, not a corrugated shipping box or plain paper cup); canonicalItemId "polystyrene-foam-box", itemName "Expanded polystyrene foam box" (a white lightweight expanded polystyrene takeout food box or cooler transport box, not flexible bubble wrap); canonicalItemId "single-use-plastic-bag", itemName "Single-use plastic carrier bag" (an ultra-thin, lightweight single-use polyethylene plastic carrier bag or market film, not a thick reusable shopping bag); canonicalItemId "plastic-bubble-wrap", itemName "Plastic bubble wrap packaging" (flexible plastic cushioning film with air-filled bubbles used for parcel packaging, not rigid foam boxes or cling wrap); canonicalItemId "renovation-rubble-tiles", itemName "Minor home renovation rubble and tiles" (dense mineral debris, shattered bricks, concrete chunks, or broken ceramic floor and wall tiles from home repairs, not dining tableware); canonicalItemId "discarded-ceramic-toilet-sink", itemName "Discarded ceramic toilet or sink" (a discarded vitreous china or porcelain toilet bowl, cistern, or bathroom washbasin, not a stainless steel sink or dining dish); canonicalItemId "used-clothing-textile", itemName "Wearable second-hand clothing" (clean wearable used garments, shirts, pants, or dresses suitable for donation or reuse, not oil-soaked rags or mattresses); canonicalItemId "worn-out-footwear", itemName "Old worn-out shoes and footwear" (torn, broken, or unwearable shoes, disintegrated foam sandals, or sneakers, not wearable shoes or rubber tires); canonicalItemId "used-medical-mask", itemName "Used disposable medical mask" (a used single-use 3-ply or 4-ply pleated surgical or medical face mask with ear loops, not a reusable cloth mask); canonicalItemId "household-medical-sharps", itemName "Household medical sharps and needles" (discarded diabetic lancets, insulin pen needles, or syringes used for domestic medical care, not sewing needles or utility blades); canonicalItemId "discarded-nail-polish-bottle", itemName "Nail polish and solvent bottle" (a small bottle containing nail polish enamel, lacquer, or acetone solvent remover with an applicator cap, not regular beverage glass); canonicalItemId "leftover-paint-can", itemName "Leftover household paint can" (a metal can or plastic bucket containing liquid or cured architectural wall paint, not an aerosol spray can); canonicalItemId "incense-joss-paper-ash", itemName "Incense ash and joss paper ash" (cold, fully extinguished ash from burnt ancestral altar incense sticks or votive spirit paper, not hot embers or charcoal slag); canonicalItemId "coffee-grounds-tea-leaves", itemName "Coffee grounds and loose tea leaves" (spent brewed coffee grounds from drip filters or loose steeped tea leaves, not synthetic plastic tea bags). Do not infer from an uncertain image or description. Return JSON with supported, confidence from 0 to 1, canonicalItemId, and exact itemName. If no supported item is clearly identified, set supported false, confidence below 0.8, canonicalItemId null, and itemName null.`
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
  let response
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(geminiUrl(), {
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
    if (response.ok || (response.status !== 503 && response.status !== 429)) break
    const delay = response.status === 429 ? 2000 * (attempt + 1) : 600 * (attempt + 1)
    await new Promise((r) => setTimeout(r, delay))
  }
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    console.error('Gemini recognition error:', response.status, errorBody)
    throw Object.assign(new Error('Recognition provider request failed.'), { status: 502 })
  }
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

function recognitionItemCriteria() {
  const criteria = Object.fromEntries([...RECOGNITION_CATEGORIES].map(([id, item]) => [id, item.criteria]))
  criteria.unsupported = 'Any other item, an item that is unclear or uncertain, or an item that does not meet one supported category exactly.'
  return criteria
}

function recognitionItemQuestions(image, description) {
  const scope = image && description
    ? ' by the description and attached image'
    : image ? ' from the attached image' : ' by the description'
  return {
    item: {
      type: 'choice',
      instructions: `Which single supported discarded household item is clearly identified${scope}? Choose unsupported for ambiguity, uncertainty, accessories, or anything outside the listed categories.`,
      criteria: recognitionItemCriteria(),
    },
  }
}

function recognitionClefState(description, image) {
  if (description && image) return { description, note: 'An image of the item is attached.' }
  if (description) return { description }
  return 'Identify the discarded household item from the attached image.'
}

function clefEmbeddedImages(image) {
  if (!image) return undefined
  return [{ content_type: image.mimeType, base64: image.base64 }]
}

function decisionChoiceToRecognition(answer) {
  if (answer?.type !== 'choice' || typeof answer.choice !== 'string' ||
    typeof answer.confidence !== 'number' || answer.confidence < 0 || answer.confidence > 1) {
    throw Object.assign(new Error('Recognition provider returned invalid data.'), { status: 502 })
  }
  const item = RECOGNITION_CATEGORIES.get(answer.choice)
  return {
    supported: Boolean(item) && answer.confidence >= RECOGNITION_CONFIDENCE_THRESHOLD,
    confidence: answer.confidence,
    canonicalItemId: answer.choice,
    itemName: item?.name ?? null,
  }
}

function decisionRecognitionIsConfident(result) {
  return result?.supported === true && typeof result.confidence === 'number' &&
    result.confidence >= RECOGNITION_CONFIDENCE_THRESHOLD && RECOGNITION_CATEGORIES.has(result.canonicalItemId)
}

async function postCloudflareClef({ accountId, token }, variant, description, image) {
  const model = variant === 'clef' ? 'clef' : 'clef-flash'
  const body = {
    model,
    state: recognitionClefState(description, image),
    questions: recognitionItemQuestions(image, description),
  }
  const images = clefEmbeddedImages(image)
  if (images) body.images = images
  const response = await fetch(cloudflareClefRunUrl(accountId, variant), {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify(body),
  })
  if (!response.ok) throw Object.assign(new Error('Recognition provider request failed.'), { status: 502 })
  let envelope
  try { envelope = await response.json() } catch {
    throw Object.assign(new Error('Recognition provider returned invalid data.'), { status: 502 })
  }
  if (envelope?.success === false) throw Object.assign(new Error('Recognition provider request failed.'), { status: 502 })
  const payload = envelope?.result ?? envelope
  return decisionChoiceToRecognition(payload?.answers?.item)
}

async function recognizeWithClef(credentials, description, image) {
  const flashResult = await postCloudflareClef(credentials, 'clef-flash', description, image)
  if (decisionRecognitionIsConfident(flashResult)) return flashResult
  const clefResult = await postCloudflareClef(credentials, 'clef', description, image)
  if (decisionRecognitionIsConfident(clefResult)) return clefResult
  return clefResult.confidence >= flashResult.confidence ? clefResult : flashResult
}

async function classifyWithJev(apiKey, model, description) {
  const envelope = await postOpenRouter(OPENROUTER_DECISIONS_URL, apiKey, {
    model,
    state: { description },
    questions: recognitionItemQuestions(null, description),
  })
  return decisionChoiceToRecognition(envelope?.answers?.item)
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
    result.confidence >= RECOGNITION_CONFIDENCE_THRESHOLD && result.confidence <= 1 && item?.name === result.itemName
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


