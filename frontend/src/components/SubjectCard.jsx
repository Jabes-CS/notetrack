import { useState } from 'react'
import AssessmentRow from './AssessmentRow'

const genId = () => Math.random().toString(36).slice(2, 9)

const gradeColor = (v) => {
  if (v === null || isNaN(v)) return '#6b7280'
  if (v >= 7) return '#10b981'
  if (v >= 5) return '#f59e0b'
  return '#ef4444'
}

export default function SubjectCard({ subject, onChange, onDelete }) {
  const [open, setOpen] = useState(true)

  const avg = subject.assessments.reduce((sum, a) => {
    if (a.grade !== '' && a.weight !== '') {
      return sum + parseFloat(a.grade) * parseFloat(a.weight) / 100
    }
    return sum
  }, 0)

  const totalWeight = subject.assessments.reduce((s, a) => s + (parseFloat(a.weight) || 0), 0)
  const weightOk = Math.abs(totalWeight - 100) < 0.01

  const addAssessment = () => onChange({
    ...subject,
    assessments: [...subject.assessments, { id: genId(), name: '', weight: '', grade: '' }]
  })

  const updateAssessment = (id, val) => onChange({
    ...subject, assessments: subject.assessments.map(a => a.id === id ? val : a)
  })

  const deleteAssessment = (id) => onChange({
    ...subject, assessments: subject.assessments.filter(a => a.id !== id)
  })

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, marginBottom: 12, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', cursor: 'pointer',
        background: 'rgba(255,255,255,0.02)',
      }} onClick={() => setOpen(o => !o)}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>

        <input value={subject.name}
          onChange={e => { e.stopPropagation(); onChange({ ...subject, name: e.target.value }) }}
          onClick={e => e.stopPropagation()}
          placeholder="Nome da matéria"
          style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 15, fontWeight: 600, color: '#e0e7ff', outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
        />

        {!weightOk && subject.assessments.length > 0 && (
          <span style={{ fontSize: 11, color: '#f59e0b', background: '#f59e0b22', padding: '2px 8px', borderRadius: 20 }}>
            Pesos: {totalWeight.toFixed(0)}%
          </span>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: `${gradeColor(avg)}15`,
          border: `1px solid ${gradeColor(avg)}40`,
          borderRadius: 20, padding: '4px 14px',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>MÉDIA</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: gradeColor(avg), fontFamily: "'DM Mono', monospace" }}>
            {avg.toFixed(2)}
          </span>
        </div>

        <button onClick={e => { e.stopPropagation(); onDelete() }} style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444', borderRadius: 8, cursor: 'pointer', padding: '4px 10px', fontSize: 12,
        }}>Remover</button>
      </div>

      {open && (
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 130px 80px 28px', gap: 8, marginBottom: 6 }}>
            {['Avaliação', 'Peso %', 'Nota (0–10)', 'Resultado', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</span>
            ))}
          </div>

          {subject.assessments.map(a => (
            <AssessmentRow key={a.id} a={a}
              onChange={val => updateAssessment(a.id, val)}
              onDelete={() => deleteAssessment(a.id)}
            />
          ))}

          <button onClick={addAssessment} style={{
            marginTop: 10, background: 'rgba(99,102,241,0.15)',
            border: '1px dashed rgba(99,102,241,0.4)', color: '#818cf8',
            borderRadius: 8, padding: '7px 16px', cursor: 'pointer',
            fontSize: 13, width: '100%', fontFamily: "'DM Sans', sans-serif",
          }}>+ Adicionar avaliação</button>
        </div>
      )}
    </div>
  )
}