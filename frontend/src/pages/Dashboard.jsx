import { useState, useEffect, useCallback } from 'react'
import api from '../api'
import SemesterCard from '../components/SemesterCard'

const gradeColor = (v) => {
  if (v === null || isNaN(v)) return '#6b7280'
  if (v >= 7) return '#10b981'
  if (v >= 5) return '#f59e0b'
  return '#ef4444'
}

export default function Dashboard({ onLogout }) {
  const [course, setCourse] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const userName = localStorage.getItem('userName') || 'Usuário'

  useEffect(() => {
    api.get('/api/course').then(res => {
      setCourse(res.data.course)
      setLoading(false)
    }).catch(() => {
      onLogout()
    })
  }, [])

  const saveData = useCallback(async (newCourse) => {
    setSaving(true)
    try {
      await api.put('/api/course', { course: newCourse })
    } catch (err) {
      console.error('Erro ao salvar:', err)
    } finally {
      setTimeout(() => setSaving(false), 800)
    }
  }, [])

  const updateSemester = (id, val) => {
    const newCourse = { ...course, semesters: course.semesters.map(s => s.id === id ? val : s) }
    setCourse(newCourse)
    saveData(newCourse)
  }

  const courseAvg = course
    ? (() => {
        const avgs = course.semesters.map(s => {
          if (!s.subjects.length) return null
          const vals = s.subjects.map(sub =>
            sub.assessments.reduce((sum, a) => {
              if (a.grade !== '' && a.weight !== '') return sum + parseFloat(a.grade) * parseFloat(a.weight) / 100
              return sum
            }, 0)
          )
          return vals.reduce((a, b) => a + b, 0) / vals.length
        }).filter(v => v !== null)
        return avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : null
      })()
    : null

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: 18, fontFamily: 'DM Sans, sans-serif' }}>
      Carregando...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif", color: '#e0e7ff' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@500&display=swap'); * { box-sizing: border-box; } input::placeholder { color: rgba(255,255,255,0.2); } input[type=number]::-webkit-inner-spin-button { opacity: 0.3; } select option { background: #1e1e2e; }`}</style>

      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <span style={{ fontSize: 24 }}>🎓</span>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#e0e7ff' }}>NoteTrack</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>/ {course?.name}</span>
        <div style={{ flex: 1 }} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: `${gradeColor(courseAvg)}15`,
          border: `1px solid ${gradeColor(courseAvg)}45`,
          borderRadius: 30, padding: '8px 20px',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Média do Curso</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: gradeColor(courseAvg), fontFamily: "'DM Mono', monospace" }}>
            {courseAvg !== null ? courseAvg.toFixed(2) : '—'}
          </span>
        </div>

        {saving && <span style={{ fontSize: 12, color: '#818cf8' }}>💾 Salvando...</span>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#fff',
          }}>{userName[0].toUpperCase()}</div>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{userName.split(' ')[0]}</span>
          <button onClick={onLogout} style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', borderRadius: 8, cursor: 'pointer', padding: '6px 12px', fontSize: 12,
          }}>Sair</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 16, padding: '20px 32px 0', overflowX: 'auto' }}>
        {course?.semesters.map(s => {
          const avg = s.subjects.length > 0
            ? s.subjects.map(sub => sub.assessments.reduce((sum, a) => {
                if (a.grade !== '' && a.weight !== '') return sum + parseFloat(a.grade) * parseFloat(a.weight) / 100
                return sum
              }, 0)).reduce((a, b) => a + b, 0) / s.subjects.length
            : null
          return (
            <div key={s.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '12px 20px', minWidth: 140, textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: gradeColor(avg), fontFamily: "'DM Mono', monospace" }}>
                {avg !== null ? avg.toFixed(2) : '—'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 32px 60px' }}>
        {course?.semesters.map(s => (
          <SemesterCard key={s.id} semester={s} onChange={val => updateSemester(s.id, val)} />
        ))}
      </div>
    </div>
  )
}