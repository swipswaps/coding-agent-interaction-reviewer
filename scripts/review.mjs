import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PROBLEMS } from '../problems/index.mjs'
import { SOLUTIONS } from '../solutions/index.mjs'
import { reviewCandidate } from '../reviewer/review.mjs'
const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
function main() {
  const rows = []
  for (const problem of PROBLEMS) for (const candidate of SOLUTIONS[problem.id] ?? []) rows.push(reviewCandidate(problem, candidate))
  const edgeCaseBroken = rows.filter((r) => r.verdict === 'edge-case-broken')
  const incorrect = rows.filter((r) => r.verdict === 'incorrect')
  const threw = rows.filter((r) => r.verdict === 'throws')
  const correct = rows.filter((r) => r.verdict === 'correct')
  const expectations = []
  for (const problem of PROBLEMS) for (const candidate of SOLUTIONS[problem.id] ?? []) {
    const row = rows.find((r) => r.problemId === problem.id && r.candidateId === candidate.id)
    if (!row) continue
    const agree = candidate.role === 'reference' ? row.verdict === 'correct' : candidate.role === 'edge-case-candidate' ? row.verdict === 'edge-case-broken' : row.verdict !== 'correct'
    expectations.push({ problemId: problem.id, candidateId: candidate.id, declaredRole: candidate.role, actual: row.verdict, agree })
  }
  const disagreements = expectations.filter((e) => !e.agree)
  const payload = {
    generatedAt: new Date().toISOString(), generator: 'scripts/review.mjs', buildId: process.env.GITHUB_SHA ?? null,
    problems: PROBLEMS.map((p) => ({ id: p.id, title: p.title, statement: p.statement, visibleCount: p.visibleTests.length, hiddenCount: p.hiddenCases.length, hiddenClasses: p.hiddenCases.map((h) => h.class) })),
    matrix: rows, expectations,
    summary: { total: rows.length, correct: correct.length, edgeCaseBroken: edgeCaseBroken.length, incorrect: incorrect.length, threw: threw.length, edgeCaseBrokenCandidates: edgeCaseBroken.map((r) => `${r.problemId}/${r.candidateId}`), disagreements: disagreements.length, sound: edgeCaseBroken.length > 0 && disagreements.length === 0 && correct.some((r) => r.role === 'reference') },
  }
  const json = JSON.stringify(payload, null, 2)
  mkdirSync(resolve(ROOT, 'src', 'generated'), { recursive: true })
  mkdirSync(resolve(ROOT, 'public'), { recursive: true })
  writeFileSync(resolve(ROOT, 'src', 'generated', 'matrix.json'), json)
  writeFileSync(resolve(ROOT, 'public', 'matrix.json'), json)
  for (const row of rows) {
    const mark = row.verdict === 'correct' ? 'ok   ' : row.verdict === 'edge-case-broken' ? 'CATCH' : 'fail '
    console.log(`  ${mark} ${row.problemId}/${row.candidateId.padEnd(3)} visible ${row.visiblePass ? 'PASS' : 'FAIL'}  hidden ${row.hiddenPass ? 'PASS' : 'FAIL'}  ${row.verdict}`)
  }
  console.log(`\nedge-case broken: ${edgeCaseBroken.length}`)
  console.log(`incorrect: ${incorrect.length}  threw: ${threw.length}  correct: ${correct.length}`)
  console.log(`sound: ${payload.summary.sound ? 'yes' : 'NO'}`)
  process.exit(0)
}
main()
