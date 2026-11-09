import { useMemo, useState } from 'react'
import data from './generated/matrix.json'

const VERDICT_CLASS = {
  strong: 'verdict--strong',
  weak: 'verdict--weak',
  misleading: 'verdict--misleading',
}

function VerdictBadge({ verdict }) {
  return <span className={`verdict ${VERDICT_CLASS[verdict] ?? ''}`}>{verdict}</span>
}

function ScoreBar({ score }) {
  const pct = (score / 2) * 100
  return (
    <div className="score-bar" role="img" aria-label={`score ${score} of 2`}>
      <i style={{ width: `${pct}%` }} />
    </div>
  )
}

function TheCatch() {
  const misleading = (data.matrix ?? []).filter((r) => r.verdict === 'misleading')
  if (misleading.length === 0) return <p className="empty-state">No misleading interactions caught.</p>
  const first = misleading[0]
  const interaction = (data.interactions ?? []).find((i) => i.id === first.interactionId)
  return (
    <div className="catch" data-testid="catch">
      <p className="catch-kicker">{misleading.length} interaction(s) would be marked strong by the shortcut, and are not</p>
      <p><strong>{first.interactionId}</strong> {interaction?.label}</p>
      <p className="catch-prompt"><span className="label">prompt</span> {interaction?.prompt}</p>
      <p className="catch-note" data-testid="catch-note">{first.note}</p>
    </div>
  )
}

function Matrix() {
  const rows = data.matrix ?? []
  const dims = data.dimensions ?? []
  if (rows.length === 0) return <p className="empty-state">No matrix yet. Run npm run review.</p>
  return (
    <div className="matrix-scroll">
      <table className="matrix" data-testid="matrix">
        <thead>
          <tr>
            <th>interaction</th>
            {dims.map((d) => <th key={d.id}>{d.label}</th>)}
            <th>verdict</th>
            <th>tempting</th>
            <th>rejects?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.interactionId} className={row.verdict === 'misleading' ? 'row-catch' : ''}>
              <th scope="row"><span className="iid">{row.interactionId}</span> {row.label}</th>
              {dims.map((d) => {
                const detail = row.detail?.find((x) => x.id === d.id)
                return <td key={d.id} className="cell"><ScoreBar score={detail?.score ?? 0} /><span className="score-num">{detail?.score ?? 0}</span></td>
              })}
              <td><VerdictBadge verdict={row.verdict} /></td>
              <td className="cell cell--tempting">{row.temptingVerdict}</td>
              <td className={`cell ${row.verdict !== row.temptingVerdict ? 'cell--pass' : 'cell--fail'}`}>{row.verdict !== row.temptingVerdict ? 'yes' : 'no'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InteractionDetail({ interaction }) {
  if (!interaction) return null
  return (
    <article className="interaction" data-testid="interaction-detail">
      <p className="interaction-label">{interaction.label}</p>
      <p className="interaction-prompt"><span className="label">prompt</span> {interaction.prompt}</p>
      <pre className="interaction-response">{interaction.response}</pre>
      <p className="interaction-catches"><span className="label">what the rubric catches</span> {interaction.catches}</p>
    </article>
  )
}

export default function App() {
  const s = data.summary ?? {}
  const interactions = data.interactions ?? []
  const [selectedId, setSelectedId] = useState(interactions[0]?.id ?? null)
  const selected = useMemo(() => interactions.find((i) => i.id === selectedId) ?? interactions[0] ?? null, [interactions, selectedId])

  return (
    <div className="app">
      <header className="page-header">
        <p className="eyebrow">Coding-agent interaction review · preamble · reasoning · judgment · trust</p>
        <h1>The code runs. That is not the question.</h1>
        <p className="page-sub">
          A rubric for evaluating coding-agent interactions on four dimensions. The shortcut verdict says strong when the code works. This rubric rejects that shortcut on every interaction where it disagrees with the reference, and the discrimination matrix shows it.
        </p>
        <dl className="stats">
          <div><dt>interactions</dt><dd>{s.total ?? 0}</dd></div>
          <div><dt>strong</dt><dd className="stat-ok">{s.strong ?? 0}</dd></div>
          <div><dt>weak</dt><dd>{s.weak ?? 0}</dd></div>
          <div><dt>misleading</dt><dd className="stat-bad">{s.misleading ?? 0}</dd></div>
          <div><dt>rejects tempting</dt><dd className={s.sound ? 'stat-ok' : 'stat-bad'}>{s.rejectsTempting ?? 0}/{s.total ?? 0}</dd></div>
          <div><dt>sound</dt><dd className={s.sound ? 'stat-ok' : 'stat-bad'}>{s.sound ? 'yes' : 'no'}</dd></div>
        </dl>
      </header>

      <main>
        <section className="panel-block">
          <h2 className="panel-heading">The catch</h2>
          <TheCatch />
        </section>

        <section className="panel-block">
          <h2 className="panel-heading">Interactions</h2>
          <nav className="interaction-nav">
            {interactions.map((i) => (
              <button key={i.id} type="button" className={`interaction-tab ${i.id === selectedId ? 'is-active' : ''}`} onClick={() => setSelectedId(i.id)} aria-pressed={i.id === selectedId}>
                <span className="tab-id">{i.id}</span><span className="tab-label">{i.label}</span>
              </button>
            ))}
          </nav>
          <InteractionDetail interaction={selected} />
        </section>

        <section className="panel-block">
          <h2 className="panel-heading">Discrimination matrix</h2>
          <p className="panel-hint">Each dimension is scored 0–2. The verdict is derived from the scores, not from whether the code runs. The “rejects?” column is the claim: the rubric disagrees with the shortcut on every interaction where the shortcut is wrong.</p>
          <Matrix />
        </section>

        <section className="panel-block">
          <h2 className="panel-heading">Known limits</h2>
          <ul className="limits-list">
            <li>Four interactions is a demonstration of the rubric, not a benchmark. A real evaluation queue needs dozens, across languages and agent tools.</li>
            <li>The scores are authored, not measured. The rubric is a scoring scheme, not a classifier; a production version would need inter-rater agreement data.</li>
            <li>The verdict derivation is stated so it can be argued with. “Strong” requires every dimension at least 1 and at least three at 2; “misleading” requires any dimension at 0. Those thresholds are choices.</li>
            <li>No Codex, Claude Code, or Cursor transcript is included. The interactions are representative of the class, not captured from a live tool.</li>
          </ul>
        </section>
      </main>

      <footer className="page-footer">
        <p>Source: <a href="https://github.com/swipswaps/coding-agent-interaction-reviewer">github.com/swipswaps/coding-agent-interaction-reviewer</a> · raw: <a href="matrix.json" download>matrix.json</a></p>
      </footer>
    </div>
  )
}
