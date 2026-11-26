import assert from 'node:assert/strict'
import test from 'node:test'
import smokingRecovery, { formatDuration, formatMilestoneAgo, getRecoveryProgress, groupRecoverySteps } from './smokingRecoveryData.ts'
import alcoholRecovery from './alcoholRecoveryData.ts'

const hour = 60 * 60 * 1000
const start = 1_000_000

test('duration displays seconds with two digits', () => {
  assert.equal(formatDuration((18 * 60 + 9) * 1000), '18m 09s')
  assert.equal(formatDuration(0), '00s')
  assert.equal(formatDuration((60 * 60 + 10) * 1000), '1h 0m 10s')
})

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
  assert.deepEqual(groups[0].entries, before.nextSteps)
  assert.ok(groups.every((group, index) => index === 0 || groups[index - 1].hours > group.hours))
  assert.deepEqual(groups.at(-1).entries, smokingRecovery.filter((step) => step.hours === 0))
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
  assert.deepEqual(groupRecoverySteps(at.achieved)[0].entries, finalEntries)
  assert.equal(at.achieved.length, alcoholRecovery.length)
  assert.equal(at.next, undefined)
})

test('major markers remain on individual entries before and after a shared milestone', () => {
  for (const steps of [smokingRecovery, alcoholRecovery]) {
    const before = getRecoveryProgress(start, start + 336 * hour - 1, steps)
    const at = getRecoveryProgress(start, start + 336 * hour, steps)
    assert.ok(before.nextSteps.some((step) => step.major))
    assert.ok(before.nextSteps.some((step) => !step.major))
    assert.deepEqual(groupRecoverySteps(at.achieved)[0].entries, before.nextSteps)
  }
})

test('reached milestone times show how long ago each milestone was reached', () => {
  assert.equal(formatMilestoneAgo(20 * 60_000, 20 / 60), 'just now')
  assert.equal(formatMilestoneAgo(21 * 60_000, 20 / 60), '1 minute ago')
  assert.equal(formatMilestoneAgo(2 * hour, 1), '1 hour ago')
  assert.equal(formatMilestoneAgo(3 * hour + 2 * 60_000, 1), '2 hours 2 minutes ago')
  assert.equal(formatMilestoneAgo(337 * hour, 0), '337 hours ago')
})
