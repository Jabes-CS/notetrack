import { useState } from 'react'
import SubjectCard from './SubjectCard'

const genId = () => Math.random().toString(36).slice(2, 9)

const gradeColor = (v) => {
  if (v === null || isNaN(v)) return '#6b7280'
  if (v >= 7) return '#10b981'
  if (v >= 5) return '#f59e0b'
  return '#ef4444'
}

export default function SemesterCard({ semester, onChange }) {
  const [open, setOpen] = useState(true)

  const subjectAvgs = semester.subjects.map(s =>
    s.assessments.reduce((sum, a) => {
      if (a.grade !== '' && a.weight !== '') return sum + parseFloat(a.grade) * parseFloat(a.weight) / 100
      return sum
    }, 0)
  )

  const avg = semester.subjects.length > 0
    ? subjectAvgs.reduce((a, b) => a + b, 0) / semester.subjects.length
    : null

  const addSubject = () => onChange({
    ...semester,
    subjects: [...semester.subjects, { id: genId(), name: '', assessments: [] }]
  })

  const updateSubject = (id, val) => onChange({
    ...semester, subjects: semester.subjects.map(s => s.id === id ? val : s)
  })

  const deleteSubject = (id) => onChange({
    ...semester, subjects: semester.subjects.filter(s => s.id !== id)
  })

  return (
    <div style={{
      marginBottom: 20, background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px', cursor: 'pointer',
        background: 'rgba(99,102,241,0.05)',
        borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }} onClick={() => setOpen(o => !o)}>
        <span style={{ color: '#818cf8', fontSize: 12, transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 16, color: '#e0e7ff' }}>{semester.label}</span>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: `${gradeColor(avg)}18`,
          border: `1px solid ${gradeColor(avg)}50`,
          borderRadius: 24, padding: '6px 18px',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Média do Semestre</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: gradeColor(avg), fontFamily: "'DM Mono', monospace" }}>
            {avg !== null ? avg.toFixed(2) : '—'}
          </span>
        </div>
      </div>

      {open && (
        <div style={{ padding: 20 }}>
          {semester.subjects.map(s => (
            <SubjectCard key={s.id} subject={s}
              onChange={val => updateSubject(s.id, val)}
              onDelete={() => deleteSubject(s.id)}
            />
          ))}
          <button onClick={addSubject} style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px dashed rgba(99,102,241,0.35)', color: '#818cf8',
            borderRadius: 10, padding: '10px 20px', cursor: 'pointer',
            fontSize: 14, width: '100%', fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>+ Adicionar Matéria</button>
        </div>
      )}
    </div>
  )
}