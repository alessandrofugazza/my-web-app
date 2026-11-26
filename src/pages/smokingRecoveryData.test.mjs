import assert from 'node:assert/strict'
import test from 'node:test'
import smokingRecovery, { getRecoveryProgress, groupRecoverySteps } from './smokingRecoveryData.ts'
import alcoholRecovery from './alcoholRecoveryData.ts'

const hour = 60 * 60 * 1000
const start = 1_000_000

test('all starting entries are reached and the next countdown uses 5 minutes', () => {
  const progress = getRecoveryProgress(start, start)
  assert.equal(progress.achieved.length, 2)
  assert.equal(progress.next.hours, 5 / 60)
  assert.equal(progress.remaining, 5 * 60 * 1000)
})

test('simultaneous milestones switch precisely at their boundary', () => {
  const before = getRecoveryProgress(start, start + 20 * 60 * 1000 - 1)
  const at = getRecoveryProgress(start, start + 20 * 60 * 1000)
  assert.equal(before.remaining, 1)
  assert.equal(before.nextSteps.length, 2)
  assert.equal(at.achieved.length, before.achieved.length + 2)
  assert.equal(at.next.hours, 0.5)
})

test('all simultaneous final milestones are next and then reached together', () => {
  const before = getRecoveryProgress(start, start + 336 * hour - 1)
  const at = getRecoveryProgress(start, start + 336 * hour)
  assert.equal(before.nextSteps.length, 16)
  assert.equal(at.achieved.length, smokingRecovery.length)
  assert.equal(at.next, undefined)
  assert.equal(at.remaining, null)
  const groups = groupRecoverySteps(at.achieved)
  assert.equal(groups[0].hours, 336)
  assert.deepEqual(groups[0].descriptions, before.nextSteps.map((step) => step.description))
  assert.ok(groups.every((group, index) => index === 0 || groups[index - 1].hours > group.hours))
  assert.deepEqual(groups.at(-1).descriptions, smokingRecovery.filter((step) => step.hours === 0).map((step) => step.description))
})

test('a clock earlier than the start does not produce negative elapsed time', () => {
  const progress = getRecoveryProgress(start, start - hour)
  assert.equal(progress.elapsed, 0)
  assert.equal(progress.remaining, 5 * 60 * 1000)
})

test('alcohol milestones use their own timeline and group simultaneous entries', () => {
  const before = getRecoveryProgress(start, start + 336 * hour - 1, alcoholRecovery)
  const at = getRecoveryProgress(start, start + 336 * hour, alcoholRecovery)
  const finalEntries = alcoholRecovery.filter((step) => step.hours === 336)
  assert.ok(finalEntries.length > 1)
  assert.deepEqual(before.nextSteps, finalEntries)
  assert.deepEqual(groupRecoverySteps(at.achieved)[0].descriptions, finalEntries.map((step) => step.description))
  assert.equal(at.achieved.length, alcoholRecovery.length)
  assert.equal(at.next, undefined)
})
