import assert from 'node:assert/strict'
import test from 'node:test'
import {createServer} from './application.mjs'

// Model fixture ignores a named schema choice when a query tool is also offered.
// This matches providers that choose a competing tool despite tool_choice.
test('explanation streams reasoning separately from answers after retrieving evidence', async () => {
  const env = {
    OPENROUTER_API_KEY: 'test-key',
    OPENROUTER_EXPLANATION_MODEL: 'stealth/space-bunny-alpha',
    SANITY_CONTEXT_MCP_URL: 'https://api.sanity.io/v1/context/organizations/test/mcp/whatbin',
    SANITY_API_READ_TOKEN: 'test-token',
  }
  const originalEnv = Object.fromEntries(Object.keys(env).map((name) => [name, process.env[name]]))
  const originalFetch = globalThis.fetch
  Object.assign(process.env, env)
  const server = createServer()
  server.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  try {
    for (const readers of [
      ['schema_explorer', 'groq_query'],
      ['knowledge_base_read', 'schema_explorer', 'groq_query', 'array_field_reader'],
      ['array_field_reader'],
    ]) {
      const names = ['initial_context', ...readers]
      const executed = []
      globalThis.fetch = async (input, init) => {
        const url = String(input)
        if (url.startsWith('https://xqeddep2.api.sanity.io/')) return Response.json({result: []})
        const request = JSON.parse(init.body)
        if (url === env.SANITY_CONTEXT_MCP_URL) {
          if (request.method === 'notifications/initialized') return new Response(null, {status: 202})
          let result
          if (request.method === 'server/discover') {
            return Response.json({jsonrpc: '2.0', id: request.id, error: {code: -32601, message: 'Method not found'}})
          }
          if (request.method === 'initialize') {
            result = {protocolVersion: request.params.protocolVersion, capabilities: {tools: {}}, serverInfo: {name: 'test-context', version: '1'}}
          } else if (request.method === 'tools/list') {
            result = {tools: names.map((name) => ({name, description: name, inputSchema: {type: 'object', properties: {}}}))}
          } else if (request.method === 'tools/call') {
            executed.push(request.params.name)
            result = {content: [{type: 'text', text: request.params.name === 'schema_explorer' ? 'disposalRule has sourceReferences' : 'Decision 87, Article 5'}]}
          } else throw new Error(`Unexpected MCP request: ${request.method}`)
          return Response.json({jsonrpc: '2.0', id: request.id, result})
        }
        assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions')
        const offered = request.tools.map(({function: tool}) => tool.name)
        const required = request.tool_choice?.function?.name
        const chosen = required === 'schema_explorer' && offered.includes('groq_query') ? 'groq_query' : required
        const delta = chosen
          ? {tool_calls: [{index: 0, id: `call-${executed.length}`, type: 'function', function: {name: chosen, arguments: '{}'}}]}
          : {reasoning: 'Checking the cited basis — đối chiếu nguồn.', content: 'The cited basis is Decision 87, Article 5.'}
        const chunk = {id: 'completion', object: 'chat.completion.chunk', created: 0, model: env.OPENROUTER_EXPLANATION_MODEL,
          choices: [{index: 0, delta, finish_reason: chosen ? 'tool_calls' : 'stop'}]}
        return new Response(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`, {headers: {'content-type': 'text/event-stream'}})
      }
      const response = await originalFetch(`http://127.0.0.1:${server.address().port}/api/explain`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({jurisdiction: 'hanoi', canonicalItemId: 'old-mattress', question: 'What is the cited basis?', confirmed: true}),
      })
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type'), /application\/x-ndjson/)
      const events = (await response.text()).trim().split('\n').map((line) => JSON.parse(line))
      assert.equal(events.at(-1).type, 'done')
      assert.equal(events.filter((event) => event.type === 'text').map((event) => event.delta).join(''), 'The cited basis is Decision 87, Article 5.')
      assert.equal(events.filter((event) => event.type === 'reasoning').map((event) => event.delta).join(''), 'Checking the cited basis — đối chiếu nguồn.')
      assert.deepEqual(executed, names.filter((name) => name !== 'array_field_reader' || !names.includes('groq_query')))
    }
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
    globalThis.fetch = originalFetch
    for (const [name, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[name]
      else process.env[name] = value
    }
  }
})
