import { test, expect } from '@playwright/test'
import { INTERACTIONS } from '../interactions/index.mjs'
import { reviewInteraction } from '../rubric/index.mjs'

test('every interaction is scored without error', () => {
  for (const i of INTERACTIONS) {
    const r = reviewInteraction(i)
    expect(r.error, i.id).toBeUndefined()
    expect(['strong', 'weak', 'misleading']).toContain(r.verdict)
  }
})

test('the rubric rejects the shortcut verdict on every interaction where it disagrees', () => {
  for (const i of INTERACTIONS) {
    const r = reviewInteraction(i)
    if (i.temptingVerdict !== i.referenceVerdict) {
      expect(r.verdict, i.id).not.toBe(i.temptingVerdict)
      expect(r.verdict, i.id).toBe(i.referenceVerdict)
    }
  }
})

test('a strong interaction has every dimension at least 1', () => {
  for (const i of INTERACTIONS) {
    const r = reviewInteraction(i)
    if (r.verdict !== 'strong') continue
    for (const d of r.detail) expect(d.score, `${i.id}/${d.id}`).toBeGreaterThanOrEqual(1)
  }
})

test('a misleading interaction has at least one dimension at 0', () => {
  for (const i of INTERACTIONS) {
    const r = reviewInteraction(i)
    if (r.verdict !== 'misleading') continue
    expect(r.detail.some((d) => d.score === 0), i.id).toBe(true)
  }
})

test('review is deterministic', () => {
  const i = INTERACTIONS[0]
  expect(JSON.stringify(reviewInteraction(i))).toBe(JSON.stringify(reviewInteraction(i)))
})
