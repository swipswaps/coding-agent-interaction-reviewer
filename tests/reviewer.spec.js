import { test, expect } from '@playwright/test'
import { PROBLEMS } from '../problems/index.mjs'
import { SOLUTIONS } from '../solutions/index.mjs'
import { reviewCandidate } from '../reviewer/review.mjs'
test('every reference solution passes every problem', () => {
  for (const problem of PROBLEMS) { const ref = SOLUTIONS[problem.id].find((s) => s.role === 'reference'); expect(reviewCandidate(problem, ref).verdict, problem.id).toBe('correct') }
})
test('every problem catches at least one edge-case candidate', () => {
  for (const problem of PROBLEMS) { const c = SOLUTIONS[problem.id].filter((s) => s.role === 'edge-case-candidate'); const caught = c.map((x) => reviewCandidate(problem, x)).filter((r) => r.verdict === 'edge-case-broken'); expect(caught.length, `${problem.id} caught none`).toBeGreaterThan(0) }
})
test('a wrong visible answer is never classified as edge-case broken', () => {
  for (const problem of PROBLEMS) for (const candidate of SOLUTIONS[problem.id].filter((s) => s.role === 'incorrect-candidate')) { const r = reviewCandidate(problem, candidate); expect(r.verdict, `${problem.id}/${candidate.id}`).not.toBe('edge-case-broken'); expect(r.verdict, `${problem.id}/${candidate.id}`).not.toBe('correct') }
})
test('review is deterministic', () => {
  const problem = PROBLEMS[0], candidate = SOLUTIONS[problem.id][0]
  expect(JSON.stringify(reviewCandidate(problem, candidate))).toBe(JSON.stringify(reviewCandidate(problem, candidate)))
})
