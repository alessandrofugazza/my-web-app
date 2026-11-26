import type { SupabaseClient } from '@supabase/supabase-js'

export interface RecoveryRecord {
  started_at: string | null
}

async function readRecord(client: SupabaseClient, userId: string): Promise<RecoveryRecord | null> {
  const { data, error } = await client.from('smoking_recovery')
    .select('started_at').eq('user_id', userId).maybeSingle<RecoveryRecord>()
  if (error) throw new Error(error.message)
  if (data?.started_at !== null && data?.started_at !== undefined && !Number.isFinite(Date.parse(data.started_at))) {
    throw new Error('The saved start time is invalid.')
  }
  return data
}

export async function loadRecovery(
  client: SupabaseClient,
  userId: string,
  readLegacy: () => string | null,
): Promise<RecoveryRecord | null> {
  const record = await readRecord(client, userId)
  if (record) return record

  let saved: string | null
  try {
    saved = readLegacy()
  } catch {
    throw new Error('Could not check this browser for existing progress. Enable browser storage and retry.')
  }
  if (saved === null) return null

  const timestamp = Number(saved)
  if (!Number.isFinite(timestamp) || timestamp <= 0 || !Number.isFinite(new Date(timestamp).getTime())) {
    throw new Error('The old browser start time is invalid and could not be imported.')
  }

  const { error } = await client.from('smoking_recovery')
    .upsert({ user_id: userId, started_at: new Date(timestamp).toISOString() }, {
      onConflict: 'user_id',
      ignoreDuplicates: true,
    })
  if (error) throw new Error(error.message)
  const imported = await readRecord(client, userId)
  if (!imported) throw new Error('The imported start time could not be found.')
  return imported
}

export async function startRecovery(
  client: SupabaseClient,
  userId: string,
  record: RecoveryRecord | null,
  startedAt: string,
): Promise<RecoveryRecord> {
  const table = client.from('smoking_recovery')
  const query = record
    ? table.update({ started_at: startedAt }).eq('user_id', userId).is('started_at', null)
    : table.insert({ user_id: userId, started_at: startedAt })
  const { data, error } = await query.select('started_at').maybeSingle<RecoveryRecord>()
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Progress changed on another device. Reload it and try again.')
  return data
}

export async function resetRecovery(
  client: SupabaseClient,
  userId: string,
  startedAt: string,
): Promise<RecoveryRecord> {
  const { data, error } = await client.from('smoking_recovery')
    .update({ started_at: null }).eq('user_id', userId).eq('started_at', startedAt)
    .select('started_at').maybeSingle<RecoveryRecord>()
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Progress changed on another device. Reload it and try again.')
  return data
}
