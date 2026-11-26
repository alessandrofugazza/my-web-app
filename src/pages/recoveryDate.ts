export function parseRecoveryDate(value: string, now: number): number {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error('Choose a valid date and time.')
  }
  const date = new Date(value)
  const timestamp = date.getTime()
  const pad = (part: number) => String(part).padStart(2, '0')
  const local = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  if (!Number.isFinite(timestamp) || local !== value) {
    throw new Error('Choose a valid local date and time.')
  }
  if (timestamp > now) throw new Error('The start time cannot be in the future.')
  return timestamp
}
