import {useState} from 'react'
import {useClient} from 'sanity'

const ITEMS = [
  {id: 'old-mattress', name: 'Old mattress'},
  {id: 'used-household-battery', name: 'Used household battery'},
  {id: 'used-lithium-ion-battery', name: 'Used rechargeable lithium-ion battery'},
  {id: 'used-power-bank', name: 'Used power bank'},
  {id: 'used-fluorescent-lamp', name: 'Used fluorescent lamp'},
  {id: 'used-mercury-thermometer', name: 'Used mercury thermometer'},
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

  return (
    <main style={{maxWidth: 960, margin: '0 auto', padding: 32, fontFamily: 'sans-serif'}}>
      <h1>Research a disposal rule</h1>
      <p>Research one recognized item and city. Results stay transient until you explicitly create an unpublished draft.</p>
      {!endpoint && <p role="alert">Source research is unavailable: SANITY_STUDIO_RESEARCH_API_URL is not configured.</p>}
      <form onSubmit={(event) => {event.preventDefault(); void research()}}>
        <label style={{display: 'block', margin: '16px 0'}}>
          Canonical item{' '}
          <select value={canonicalItemId} onChange={(event) => setCanonicalItemId(event.target.value)}>
            {ITEMS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label style={{display: 'block', margin: '16px 0'}}>
          City{' '}
          <select value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)}>
            {CITIES.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
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
