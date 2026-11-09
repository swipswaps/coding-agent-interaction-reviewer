import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { INTERACTIONS } from '../interactions/index.mjs'
import { reviewInteraction, DIMENSIONS } from '../rubric/index.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

function main() {
  const rows = INTERACTIONS.map((i) => reviewInteraction(i))
  const strong = rows.filter((r) => r.verdict === 'strong')
  const weak = rows.filter((r) => r.verdict === 'weak')
  const misleading = rows.filter((r) => r.verdict === 'misleading')

  const checks = rows.map((r) => ({
    interactionId: r.interactionId,
    tempting: r.temptingVerdict,
    reference: r.referenceVerdict,
    measured: r.verdict,
    rejectsTempting: r.verdict !== r.temptingVerdict,
    matchesReference: r.verdict === r.referenceVerdict,
  }))
  const failures = checks.filter((c) => !c.rejectsTempting || !c.matchesReference)

  const payload = {
    generatedAt: new Date().toISOString(),
    generator: 'scripts/review.mjs',
    buildId: process.env.GITHUB_SHA ?? null,
    dimensions: DIMENSIONS.map((d) => ({ id: d.id, label: d.label, question: d.question, weight: d.weight })),
    interactions: INTERACTIONS.map((i) => ({
      id: i.id, label: i.label, prompt: i.prompt, response: i.response,
      scores: i.scores, temptingVerdict: i.temptingVerdict,
      referenceVerdict: i.referenceVerdict, catches: i.catches,
    })),
    matrix: rows,
    checks,
    summary: {
      total: rows.length,
      strong: strong.length,
      weak: weak.length,
      misleading: misleading.length,
      rejectsTempting: checks.filter((c) => c.rejectsTempting).length,
      matchesReference: checks.filter((c) => c.matchesReference).length,
      sound: failures.length === 0,
    },
  }

  const json = JSON.stringify(payload, null, 2)
  mkdirSync(resolve(ROOT, 'src', 'generated'), { recursive: true })
  mkdirSync(resolve(ROOT, 'public'), { recursive: true })
  writeFileSync(resolve(ROOT, 'src', 'generated', 'matrix.json'), json)
  writeFileSync(resolve(ROOT, 'public', 'matrix.json'), json)

  for (const row of rows) {
    const mark = row.verdict === 'strong' ? 'ok   ' : row.verdict === 'misleading' ? 'CATCH' : 'weak '
    console.log(`  ${mark} ${row.interactionId.padEnd(3)} ${row.verdict.padEnd(12)} tempting=${row.temptingVerdict.padEnd(12)} ref=${row.referenceVerdict}`)
  }
  console.log(`\nstrong: ${strong.length}  weak: ${weak.length}  misleading: ${misleading.length}`)
  console.log(`rejects tempting: ${checks.filter((c) => c.rejectsTempting).length}/${checks.length}`)
  console.log(`matches reference: ${checks.filter((c) => c.matchesReference).length}/${checks.length}`)
  console.log(`sound: ${payload.summary.sound ? 'yes' : 'NO'}`)
  process.exit(0)
}

main()
