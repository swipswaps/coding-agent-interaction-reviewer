// The interaction-review rubric.
//
// Each dimension is scored 0 (absent), 1 (partial), or 2 (present).
// The overall verdict is derived from the scores, not from whether the code
// happens to work. That is the whole argument: a response can produce correct
// code and still be a weak engineering interaction, and a response can produce
// broken code and still be a strong one because the reasoning is honest.
//
// Dimensions, mapped to the G2i posting's own wording:
//
//   preamble      "Whether the preamble and reasoning are useful"
//   reasoning     "Whether the response makes sense"
//   judgment      "Whether the output reflects strong engineering judgment"
//   trust         "Whether the interaction feels right to an experienced
//                 developer" / "Would this build or erode trust"

export const DIMENSIONS = [
  {
    id: 'preamble',
    label: 'Preamble',
    question: 'Does the preamble help the reader decide what to do, or is it noise?',
    weight: 0.25,
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    question: 'Does the explanation hold together, or does it assert without support?',
    weight: 0.25,
  },
  {
    id: 'judgment',
    label: 'Engineering judgment',
    question: 'Does the response reflect how a strong engineer would think about the problem?',
    weight: 0.30,
  },
  {
    id: 'trust',
    label: 'Trust calibration',
    question: 'Would this interaction build or erode an experienced developer’s trust?',
    weight: 0.20,
  },
]

// The verdict vocabulary. "strong" is not the same as "the code works".
export const VERDICTS = ['strong', 'weak', 'misleading']

// The tempting shortcut verdict for each interaction: the verdict a reviewer
// reaches for when the only signal they check is "does the code run".
// The rubric is expected to disagree with every one of these.

export function scoreInteraction(interaction, scores) {
  let weighted = 0
  let totalWeight = 0
  const detail = []

  for (const dim of DIMENSIONS) {
    const raw = scores[dim.id]
    if (typeof raw !== 'number' || raw < 0 || raw > 2) {
      return { error: `invalid score for ${dim.id}: ${raw}` }
    }
    weighted += raw * dim.weight
    totalWeight += 2 * dim.weight
    detail.push({ id: dim.id, label: dim.label, score: raw, question: dim.question })
  }

  const normalised = totalWeight > 0 ? weighted / totalWeight : 0
  const percent = Math.round(normalised * 100)

  // Derivation, stated so it can be argued with:
  //   strong      every dimension at least 1, and at least three at 2
  //   misleading  any dimension at 0 (the response actively misleads)
  //   weak        everything else (correct but not strong, or partial)
  const atLeastOne = DIMENSIONS.every((d) => scores[d.id] >= 1)
  const atLeastThreeTwos = DIMENSIONS.filter((d) => scores[d.id] === 2).length >= 3
  const anyZero = DIMENSIONS.some((d) => scores[d.id] === 0)

  let verdict
  if (anyZero) verdict = 'misleading'
  else if (atLeastOne && atLeastThreeTwos) verdict = 'strong'
  else verdict = 'weak'

  return { verdict, percent, detail, interactionId: interaction.id }
}

export function reviewInteraction(interaction) {
  const scored = scoreInteraction(interaction, interaction.scores)
  return {
    ...scored,
    prompt: interaction.prompt,
    response: interaction.response,
    label: interaction.label,
    temptingVerdict: interaction.temptingVerdict,
    referenceVerdict: interaction.referenceVerdict,
    catches: interaction.catches,
    note: buildNote(scored.verdict, interaction),
  }
}

function buildNote(verdict, interaction) {
  if (verdict === 'strong') {
    return `Strong interaction: preamble is useful, reasoning holds, judgment reflects a senior engineer, and the response earns trust.`
  }
  if (verdict === 'misleading') {
    return `Misleading: at least one dimension is absent. ${interaction.catches}`
  }
  return `Weak: the code may run, but at least one dimension is partial. ${interaction.catches}`
}
