import {useState} from 'react'
import {useClient} from 'sanity'

const ITEMS = [
  {id: 'old-mattress', name: 'Old mattress'},
  {id: 'used-household-battery', name: 'Used household battery'},
  {id: 'used-lithium-ion-battery', name: 'Used rechargeable lithium-ion battery'},
  {id: 'used-power-bank', name: 'Used power bank'},
  {id: 'used-fluorescent-lamp', name: 'Used fluorescent lamp'},
  {id: 'used-mercury-thermometer', name: 'Used mercury thermometer'},
  {id: 'used-mobile-phone', name: 'Used mobile phone'},
  {id: 'cooked-food-scrap', name: 'Cooked food scrap'},
  {id: 'fruit-vegetable-peel', name: 'Raw fruit and vegetable peel'},
  {id: 'fallen-leaves-garden-waste', name: 'Fallen leaves and garden waste'},
  {id: 'discarded-coconut-shell', name: 'Discarded coconut shell'},
  {id: 'large-animal-bone', name: 'Large animal bone'},
  {id: 'pet-plastic-bottle', name: 'PET plastic beverage bottle'},
  {id: 'corrugated-cardboard-box', name: 'Corrugated cardboard box'},
  {id: 'aluminum-beverage-can', name: 'Aluminum beverage can'},
  {id: 'glass-bottle-jar', name: 'Glass bottle or jar'},
  {id: 'expired-household-medicine', name: 'Expired household medicine'},
  {id: 'used-cooking-oil', name: 'Used cooking oil'},
  {id: 'aerosol-spray-can', name: 'Aerosol spray can'},
  {id: 'household-pesticide-container', name: 'Household pesticide container'},
  {id: 'discarded-wooden-furniture', name: 'Discarded wooden furniture'},
  {id: 'discarded-upholstered-sofa', name: 'Discarded upholstered sofa'},
  {id: 'discarded-electric-fan', name: 'Discarded electric fan'},
  {id: 'discarded-laptop', name: 'Discarded laptop computer'},
  {id: 'discarded-microwave-oven', name: 'Discarded microwave oven'},
  {id: 'discarded-charging-cable', name: 'Discarded charging cable'},
  {id: 'disposable-baby-diaper', name: 'Disposable baby diaper'},
  {id: 'broken-ceramic-tableware', name: 'Broken ceramic dish or shards'},
  {id: 'multi-layer-snack-packaging', name: 'Multi-layer snack packaging'},
  {id: 'used-motor-oil', name: 'Used motorbike engine motor oil'},
  {id: 'used-lead-acid-accumulator', name: 'Discarded motorbike lead-acid battery'},
  {id: 'used-motorbike-tire', name: 'Used motorbike tires and inner tubes'},
  {id: 'discarded-motorbike-helmet', name: 'Discarded motorbike helmet'},
  {id: 'beverage-carton-tetra-pak', name: 'Aseptic multi-layer beverage carton'},
  {id: 'polystyrene-foam-box', name: 'Expanded polystyrene foam box'},
  {id: 'single-use-plastic-bag', name: 'Single-use plastic carrier bag'},
  {id: 'plastic-bubble-wrap', name: 'Plastic bubble wrap packaging'},
  {id: 'renovation-rubble-tiles', name: 'Minor home renovation rubble and tiles'},
  {id: 'discarded-ceramic-toilet-sink', name: 'Discarded ceramic toilet or sink'},
  {id: 'used-clothing-textile', name: 'Wearable second-hand clothing'},
  {id: 'worn-out-footwear', name: 'Old worn-out shoes and footwear'},
  {id: 'used-medical-mask', name: 'Used disposable medical mask'},
  {id: 'household-medical-sharps', name: 'Household medical sharps and needles'},
  {id: 'discarded-nail-polish-bottle', name: 'Nail polish and solvent bottle'},
  {id: 'leftover-paint-can', name: 'Leftover household paint can'},
  {id: 'incense-joss-paper-ash', name: 'Incense ash and joss paper ash'},
  {id: 'coffee-grounds-tea-leaves', name: 'Coffee grounds and loose tea leaves'},
] as const

const CITIES = [
  {id: 'hanoi', name: 'Hanoi'},
  {id: 'ho-chi-minh-city', name: 'Ho Chi Minh City'},
] as const

type Candidate = {
  canonicalItemId: string
  itemName: string
  jurisdiction: string
  disposalCategory: string
  instruction: string
  validFrom: string
  validUntil: string | null
  sourceReferences: Array<{
    title: string
    url: string
    citation: string
    sourceRole: 'binding-rule' | 'agency-clarification' | 'currentness-record'
  }>
  supportingPassages: Array<{
    sourceTitle: string
    sourceUrl: string
    sourceCitation: string
    sourceVersion: string
    citation: string
    text: string
    requires: Array<{title: string; url: string; citation: string}>
    claimType: 'disposal' | 'currentness' | 'agency-logistics'
  }>
}

type ResearchResult =
  | {status: 'PREVIEW'; candidate: Candidate}
  | {status: 'GAP'; reason: string}

const endpoint = (import.meta as unknown as {env: Record<string, string | undefined>}).env.SANITY_STUDIO_RESEARCH_API_URL?.trim()

export function SourceResearchTool() {
  const client = useClient({apiVersion: '2025-07-11'})
  const [canonicalItemId, setCanonicalItemId] = useState<string>(ITEMS[0].id)
  const [jurisdiction, setJurisdiction] = useState<string>(CITIES[0].id)
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)

  async function research() {
    setError(null)
    setResult(null)
    setCreatedId(null)
    const token = client.config().token
    if (!endpoint) {
      setError('Source research is unavailable: SANITY_STUDIO_RESEARCH_API_URL is not configured.')
      return
    }
    if (!token) {
      setError('Source research requires an authenticated Studio token. Sign in with an account that can access this project.')
      return
    }

    setBusy(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({canonicalItemId, jurisdiction}),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : `Research request failed (${response.status}).`)
      }
      if (body?.status === 'PREVIEW' && body.candidate) setResult(body as ResearchResult)
      else if (body?.status === 'GAP' && typeof body.reason === 'string') setResult(body as ResearchResult)
      else throw new Error('The research service returned an invalid response.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Source research failed.')
    } finally {
      setBusy(false)
    }
  }

  async function createDraft() {
    if (result?.status !== 'PREVIEW') return
    setError(null)
    setBusy(true)
    const candidate = result.candidate
    const id = `drafts.${candidate.canonicalItemId}-${candidate.jurisdiction}-research-v${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
    try {
      await client.create({_id: id, _type: 'disposalRule', ...candidate})
      setCreatedId(id)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create the unpublished draft.')
    } finally {
      setBusy(false)
    }
  }

  const phoneOnlyHanoi = canonicalItemId === 'used-mobile-phone'
  const availableCities = phoneOnlyHanoi ? CITIES.slice(0, 1) : CITIES
  return (
    <main style={{maxWidth: 960, margin: '0 auto', padding: 32, fontFamily: 'sans-serif'}}>
      <h1>Research a disposal rule</h1>
      <p>Research one recognized item and city. Results stay transient until you explicitly create an unpublished draft.</p>
      {!endpoint && <p role="alert">Source research is unavailable: SANITY_STUDIO_RESEARCH_API_URL is not configured.</p>}
      <form onSubmit={(event) => {event.preventDefault(); void research()}}>
        <label style={{display: 'block', margin: '16px 0'}}>
          Canonical item{' '}
          <select value={canonicalItemId} onChange={(event) => {
            const itemId = event.target.value
            setCanonicalItemId(itemId)
            if (itemId === 'used-mobile-phone') setJurisdiction('hanoi')
          }}>
            {ITEMS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label style={{display: 'block', margin: '16px 0'}}>
          City{' '}
          <select value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)}>
            {availableCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
        </label>
        <button type="submit" disabled={busy || !endpoint}>{busy ? 'Working…' : 'Research sources'}</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {createdId && <p role="status">Unpublished draft created: <code>{createdId}</code>. Review it in Structure before publishing.</p>}
      {result?.status === 'GAP' && (
        <section aria-live="polite">
          <h2>Research gap</h2>
          <p>{result.reason}</p>

        </section>
      )}
      {result?.status === 'PREVIEW' && (
        <section aria-live="polite">
          <h2>Transient preview</h2>
          <h3>{result.candidate.itemName} — {result.candidate.jurisdiction}</h3>
          <p><strong>Category:</strong> {result.candidate.disposalCategory}</p>
          <p><strong>Instruction:</strong> {result.candidate.instruction}</p>
          <p><strong>Valid from:</strong> {result.candidate.validFrom}</p>
          {result.candidate.validUntil && <p><strong>Valid until:</strong> {result.candidate.validUntil}</p>}
          <h3>Sources</h3>
          <ul>{result.candidate.sourceReferences.map((source) => (
            <li key={`${source.url}-${source.citation}`}>
              <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> ({source.sourceRole}) — {source.citation}
            </li>
          ))}</ul>
          <h3>Supporting passages</h3>
          {result.candidate.supportingPassages.map((passage) => (
            <article key={`${passage.sourceUrl}-${passage.sourceCitation}-${passage.citation}-${passage.sourceVersion}-${passage.claimType}-${passage.text}`}>
              <h4>{passage.sourceTitle}</h4>
              <p>{passage.sourceCitation}; {passage.citation}; {passage.sourceVersion}</p>
              <blockquote>{passage.text}</blockquote>
              <p>Claim: {passage.claimType}</p>
              {passage.requires.length > 0 && <ul>{passage.requires.map((source) => (
                <li key={`${source.url}-${source.citation}`}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> — {source.citation}</li>
              ))}</ul>}
            </article>
          ))}
          <button type="button" onClick={() => void createDraft()} disabled={busy}>
            Create unpublished draft
          </button>
        </section>
      )}
    </main>
  )
}
