const gradeColor = (v) => {
  if (v === null || isNaN(v)) return '#6b7280'
  if (v >= 7) return '#10b981'
  if (v >= 5) return '#f59e0b'
  return '#ef4444'
}

export default function AssessmentRow({ a, onChange, onDelete }) {
  const result = a.grade !== '' && a.weight !== ''
    ? (parseFloat(a.grade) * parseFloat(a.weight) / 100).toFixed(2)
    : null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 90px 130px 80px 28px',
      gap: 8, alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <input value={a.name} onChange={e => onChange({ ...a, name: e.target.value })}
        placeholder="Ex: Prova 1, Projeto..." style={inp} />

      <input type="number" min="0" max="100" value={a.weight}
        onChange={e => onChange({ ...a, weight: e.target.value })}
        placeholder="Peso %" style={{ ...inp, color: 'rgba(255,255,255,0.4)' }} />

      <input type="number" min="0" max="10" step="0.1" value={a.grade}
        onChange={e => onChange({ ...a, grade: e.target.value })}
        placeholder="Nota (0–10)" style={inp} />

      <div style={{
        background: result !== null ? `${gradeColor(parseFloat(result))}22` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${result !== null ? gradeColor(parseFloat(result)) + '55' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 8, padding: '6px 8px', textAlign: 'center',
        fontSize: 13, fontWeight: 700,
        color: result !== null ? gradeColor(parseFloat(result)) : 'rgba(255,255,255,0.2)',
        fontFamily: "'DM Mono', monospace",
      }}>
        {result ?? '—'}
      </div>

      <button onClick={onDelete} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
        cursor: 'pointer', fontSize: 16, padding: 0,
      }}
        onMouseEnter={e => e.target.style.color = '#ef4444'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}
      >✕</button>
    </div>
  )
}

const inp = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '7px 10px',
  color: '#e0e7ff', fontSize: 13,
  width: '100%', boxSizing: 'border-box',
  fontFamily: "'DM Sans', sans-serif", outline: 'none',
}