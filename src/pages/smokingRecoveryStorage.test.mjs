import assert from 'node:assert/strict'
import test from 'node:test'
import { createClient } from '@supabase/supabase-js'
import { loadRecovery, resetRecovery, startRecovery } from './smokingRecoveryStorage.ts'

const userId = 'c5732b4a-f437-4a6f-9078-1991110a3340'
const timestamp = '2026-11-25T12:00:00.000Z'

function clientWithResponses(responses) {
  const requests = []
  const client = createClient('https://example.test', 'test-key', {
    auth: { persistSession: false },
    global: {
      fetch: async (url, options) => {
        requests.push({ url: new URL(url), ...options })
        const response = responses.shift()
        assert.ok(response, 'Unexpected database request')
        return new Response(JSON.stringify(response.body), {
          status: response.status ?? 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  })
  return { client, requests }
}

test('imports existing browser progress only if the account has no record', async () => {
  const { client, requests } = clientWithResponses([
    { body: [] },
    { body: [] },
    { body: [{ started_at: timestamp }] },
  ])
  const record = await loadRecovery(client, userId, () => String(Date.parse(timestamp)))
  assert.equal(record.started_at, timestamp)
  assert.equal(requests[1].method, 'POST')
  assert.match(requests[1].headers.get('Prefer'), /resolution=ignore-duplicates/)
  assert.deepEqual(JSON.parse(requests[1].body), { user_id: userId, started_at: timestamp })
})

test('an existing reset takes precedence over old browser progress', async () => {
  const { client, requests } = clientWithResponses([{ body: [{ started_at: null }] }])
  const record = await loadRecovery(client, userId, () => {
    throw new Error('Legacy storage must not be read')
  })
  assert.equal(record.started_at, null)
  assert.equal(requests.length, 1)
})

test('a concurrent account record wins over a legacy import', async () => {
  const { client } = clientWithResponses([
    { body: [] },
    { body: [] },
    { body: [{ started_at: null }] },
  ])
  const record = await loadRecovery(client, userId, () => String(Date.parse(timestamp)))
  assert.equal(record.started_at, null)
})

test('a new account can start without browser progress', async () => {
  const { client, requests } = clientWithResponses([
    { body: [] },
    { body: [{ started_at: timestamp }] },
  ])
  const record = await loadRecovery(client, userId, () => null)
  assert.equal(record, null)
  assert.equal((await startRecovery(client, userId, record, timestamp)).started_at, timestamp)
  assert.deepEqual(JSON.parse(requests[1].body), { user_id: userId, started_at: timestamp })
})

test('start and reset persist through account-scoped conditional writes', async () => {
  const { client, requests } = clientWithResponses([
    { body: [{ started_at: timestamp }] },
    { body: [{ started_at: null }] },
  ])
  const started = await startRecovery(client, userId, { started_at: null }, timestamp)
  const reset = await resetRecovery(client, userId, started.started_at)
  assert.equal(reset.started_at, null)
  assert.equal(requests[0].url.searchParams.get('user_id'), `eq.${userId}`)
  assert.equal(requests[0].url.searchParams.get('started_at'), 'is.null')
  assert.equal(requests[1].url.searchParams.get('started_at'), `eq.${timestamp}`)
})

test('concurrent changes and database failures are surfaced', async () => {
  const { client } = clientWithResponses([
    { body: [] },
    { status: 500, body: { message: 'Database unavailable' } },
  ])
  await assert.rejects(resetRecovery(client, userId, timestamp), /changed on another device/)
  await assert.rejects(loadRecovery(client, userId, () => null), /Database unavailable/)
})
