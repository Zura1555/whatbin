import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const projectId = 'xqeddep2'
const dataset = 'production'
const apiVersion = '2025-07-11'
const api = `https://${projectId}.api.sanity.io/v${apiVersion}`

async function getAuthToken() {
  if (process.env.SANITY_API_TOKEN) return process.env.SANITY_API_TOKEN
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN
  try {
    const home = process.env.HOME || '/home/tuantran01'
    const configPath = `${home}/.config/sanity/config.json`
    const config = JSON.parse(await readFile(configPath, 'utf8'))
    if (config.authToken) return config.authToken
  } catch {
    // ignore
  }
  return null
}

async function main() {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('No Sanity authentication token found in SANITY_API_TOKEN, SANITY_AUTH_TOKEN, or ~/.config/sanity/config.json')
  }

  const targetFiles = process.argv[2]
    ? [process.argv[2]]
    : [
        fileURLToPath(new URL('../drafts/top-items-disposal-rules.json', import.meta.url)),
        fileURLToPath(new URL('../drafts/all-remaining-disposal-rules.json', import.meta.url)),
      ]

  let allDocs = []
  for (const f of targetFiles) {
    try {
      const docs = JSON.parse(await readFile(f, 'utf8'))
      allDocs.push(...docs)
    } catch (e) {
      console.warn(`Could not read ${f}:`, e.message)
    }
  }

  console.log(`Preparing to import and publish ${allDocs.length} disposal rules...`)

  const mutations = allDocs.map((doc) => ({
    createOrReplace: doc,
  }))

  const res = await fetch(`${api}/data/mutate/${dataset}?returnIds=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Sanity API error (${res.status}): ${errorText}`)
  }

  const data = await res.json()
  console.log(`Successfully published ${data.results?.length ?? docs.length} rules to ${dataset} dataset!`)
  for (const item of data.results ?? []) {
    console.log(` - ${item.operation}: ${item.id}`)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { main }
