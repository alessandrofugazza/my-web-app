import assert from 'node:assert/strict'
import test from 'node:test'
import { parseRecoveryDate } from './recoveryDate.ts'

test('a past local date and minute is converted to the corresponding instant', () => {
  const expected = new Date(2025, 2, 15, 13, 47).getTime()
  assert.equal(parseRecoveryDate('2025-03-15T13:47', expected + 60_000), expected)
})

test('invalid, normalized and future dates are rejected', () => {
  assert.throws(() => parseRecoveryDate('', Date.now()), /valid/)
  assert.throws(() => parseRecoveryDate('2025-02-30T12:00', Date.now()), /valid/)
  assert.throws(() => parseRecoveryDate('2025-03-15T13:47', new Date(2025, 2, 15, 13, 46).getTime()), /future/)
})
