import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({
    name: '', email: '', password: '', course_name: '', semester_count: 8
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register'
      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { ...form, semester_count: parseInt(form.semester_count) }

      const res = await api.post(endpoint, payload)
      localStorage.setItem('userName', res.data.name)
      localStorage.setItem('courseName', res.data.course.name)
      onLogin(res.data.token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <style>{fonts}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.emoji}>🎓</span>
          <h1 style={styles.title}>NoteTrack</h1>
          <p style={styles.subtitle}>Seu desempenho acadêmico em tempo real</p>
        </div>

        <div style={styles.tabs}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              ...styles.tab,
              background: tab === t ? 'rgba(99,102,241,0.8)' : 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
            }}>
              {t === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          ))}
        </div>

        {tab === 'register' && (
          <>
            <label style={styles.label}>Seu nome</label>
            <input name="name" value={form.name} onChange={handle}
              placeholder="Nome completo" style={styles.input} />

            <label style={styles.label}>Nome do Curso</label>
            <input name="course_name" value={form.course_name} onChange={handle}
              placeholder="Ex: Sistemas de Informação" style={styles.input} />

            <label style={styles.label}>Quantidade de Semestres</label>
            <select name="semester_count" value={form.semester_count} onChange={handle} style={styles.input}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} semestre{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </>
        )}

        <label style={styles.label}>E-mail</label>
        <input name="email" type="email" value={form.email} onChange={handle}
          placeholder="seu@email.com" style={styles.input} />

        <label style={styles.label}>Senha</label>
        <input name="password" type="password" value={form.password} onChange={handle}
          placeholder="••••••••" style={styles.input} />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={submit} disabled={loading} style={styles.button}>
          {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar Conta'}
        </button>
      </div>
    </div>
  )
}

const fonts = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@500&display=swap');`

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#0a0a0f',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 40, width: 420,
    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
  },
  header: { textAlign: 'center', marginBottom: 32 },
  emoji: { fontSize: 36 },
  title: {
    color: '#e0e7ff', fontFamily: "'DM Serif Display', serif",
    margin: '8px 0 0', fontSize: 28,
  },
  subtitle: { color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 6 },
  tabs: {
    display: 'flex', background: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 4, marginBottom: 24,
  },
  tab: {
    flex: 1, padding: 10, border: 'none', borderRadius: 9,
    cursor: 'pointer', fontWeight: 600, fontSize: 14,
    transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
  },
  label: {
    display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    padding: '10px 12px', color: '#e0e7ff', fontSize: 14,
    marginBottom: 16, boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
  },
  error: { color: '#ef4444', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  button: {
    width: '100%', padding: 14,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none', borderRadius: 12, color: '#fff',
    fontWeight: 700, fontSize: 15, cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
    fontFamily: "'DM Sans', sans-serif",
  },
}