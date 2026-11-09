import { useMemo, useState } from 'react'
import data from './generated/matrix.json'
const VERDICT_LABEL = { correct: 'correct', 'edge-case-broken': 'edge-case broken', incorrect: 'incorrect', throws: 'throws' }
function VerdictBadge({ verdict }) { return <span className={`badge badge--${verdict}`}>{VERDICT_LABEL[verdict] ?? verdict}</span> }
function TheCatch() {
  const broken = (data.matrix ?? []).filter((r) => r.verdict === 'edge-case-broken')
  if (broken.length === 0) return <p className="empty-state">No edge-case candidates caught.</p>
  const first = broken[0]
  const problem = (data.problems ?? []).find((p) => p.id === first.problemId)
  return (
    <div className="catch" data-testid="catch">
      <p className="catch-kicker">{broken.length} candidate(s) pass every visible test and are still wrong</p>
      <p><strong>{first.problemId}</strong> {problem?.title}</p>
      <p><strong>{first.candidateId}</strong> — {first.label}</p>
      {first.firstHiddenFailure ? (
        <dl className="catch-grid">
          <dt>hidden input</dt><dd><code>{JSON.stringify(first.firstHiddenFailure.input)}</code></dd>
          <dt>expected</dt><dd><code>{JSON.stringify(first.firstHiddenFailure.expected)}</code></dd>
          <dt>got</dt><dd><code>{JSON.stringify(first.firstHiddenFailure.actual)}</code></dd>
          <dt>catches</dt><dd>{first.firstHiddenFailure.catches}</dd>
        </dl>
      ) : null}
      <p className="catch-note" data-testid="catch-note">{first.note}</p>
    </div>
  )
}
function MatrixTable() {
  const rows = data.matrix ?? []; const problems = data.problems ?? []
  if (rows.length === 0) return <p className="empty-state">No matrix yet. Run npm run review.</p>
  return (
    <div className="matrix-scroll"><table className="matrix" data-testid="matrix">
      <thead><tr><th>problem</th><th>candidate</th><th>visible</th><th>hidden</th><th>verdict</th></tr></thead>
      <tbody>
        {problems.map((problem) => rows.filter((r) => r.problemId === problem.id).map((row, i) => (
          <tr key={`${row.problemId}-${row.candidateId}`} className={row.verdict === 'edge-case-broken' ? 'row-catch' : ''}>
            <th scope="row">{i === 0 ? <><span className="problem-id">{problem.id}</span><span className="problem-title">{problem.title}</span></> : null}</th>
            <td><span className="cand-id">{row.candidateId}</span><span className="cand-label">{row.label}</span></td>
            <td className={`cell ${row.visiblePass ? 'cell--pass' : 'cell--fail'}`}>{row.visiblePass ? 'PASS' : 'FAIL'}</td>
            <td className={`cell ${row.hiddenPass ? 'cell--pass' : 'cell--fail'}`}>{row.hiddenPass ? 'PASS' : 'FAIL'}</td>
            <td><VerdictBadge verdict={row.verdict} /></td>
          </tr>
        )))}
      </tbody>
    </table></div>
  )
}
function ReviewNotes() {
  const broken = (data.matrix ?? []).filter((r) => r.verdict === 'edge-case-broken')
  if (broken.length === 0) return null
  return (<section className="panel-block"><h2 className="panel-heading">Review notes</h2>
    <ul className="notes">{broken.map((row) => (<li key={`${row.problemId}-${row.candidateId}`} className="note"><span className="note-id">{row.problemId}/{row.candidateId}</span><span className="note-text">{row.note}</span></li>))}</ul>
  </section>)
}
export default function App() {
  const s = data.summary ?? {}; const problems = data.problems ?? []
  const [selectedId, setSelectedId] = useState(problems[0]?.id ?? null)
  const selected = useMemo(() => problems.find((p) => p.id === selectedId) ?? problems[0] ?? null, [problems, selectedId])
  const selectedRows = (data.matrix ?? []).filter((r) => r.problemId === selectedId)
  return (
    <div className="app">
      <header className="page-header">
        <p className="eyebrow">Solution review · visible tests · hidden edge cases</p>
        <h1>The solution that passes every test you showed it</h1>
        <p className="page-sub">Runs candidate code against visible tests and hidden edge cases derived from the stated constraints. A candidate that passes the first and fails the second is reported as edge-case broken.</p>
        <dl className="stats">
          <div><dt>candidates</dt><dd>{s.total ?? 0}</dd></div>
          <div><dt>edge-case broken</dt><dd className="stat-bad" data-testid="stat-broken">{s.edgeCaseBroken ?? 0}</dd></div>
          <div><dt>incorrect</dt><dd>{s.incorrect ?? 0}</dd></div>
          <div><dt>correct</dt><dd className="stat-ok">{s.correct ?? 0}</dd></div>
          <div><dt>sound</dt><dd className={s.sound ? 'stat-ok' : 'stat-bad'}>{s.sound ? 'yes' : 'no'}</dd></div>
        </dl>
      </header>
      <main>
        <section className="panel-block"><h2 className="panel-heading">The catch</h2><TheCatch /></section>
        <section className="panel-block">
          <h2 className="panel-heading">Problems</h2>
          <nav className="problem-nav">{problems.map((p) => (<button key={p.id} type="button" className={`problem-tab ${p.id === selectedId ? 'is-active' : ''}`} onClick={() => setSelectedId(p.id)} aria-pressed={p.id === selectedId}><span className="tab-id">{p.id}</span><span className="tab-title">{p.title}</span></button>))}</nav>
          {selected ? (<article className="problem" data-testid="problem-detail"><h3>{selected.title}</h3><p className="problem-statement">{selected.statement}</p>
            <table className="detail-table"><thead><tr><th>candidate</th><th>visible</th><th>hidden</th><th>verdict</th></tr></thead>
              <tbody>{selectedRows.map((row) => (<tr key={row.candidateId}><th scope="row"><span className="cand-id">{row.candidateId}</span> {row.label}</th>
                <td className={`cell ${row.visiblePass ? 'cell--pass' : 'cell--fail'}`}>{row.visiblePass ? 'PASS' : 'FAIL'}</td>
                <td className={`cell ${row.hiddenPass ? 'cell--pass' : 'cell--fail'}`}>{row.hiddenPass ? 'PASS' : 'FAIL'}</td>
                <td><VerdictBadge verdict={row.verdict} /></td></tr>))}</tbody></table></article>) : null}
        </section>
        <section className="panel-block"><h2 className="panel-heading">Full matrix</h2><MatrixTable /></section>
        <ReviewNotes />
        <section className="panel-block"><h2 className="panel-heading">Known limits</h2><ul className="limits-list">
          <li>JavaScript only.</li><li>Hidden cases are not exhaustive.</li>
          <li>node:vm is not a security boundary.</li><li>No style or complexity judgement.</li>
        </ul></section>
      </main>
      <footer className="page-footer"><p>Source: <a href="https://github.com/swipswaps/edge-case-solution-reviewer">github.com/swipswaps/edge-case-solution-reviewer</a> · raw: <a href="matrix.json" download>matrix.json</a></p></footer>
    </div>
  )
}
