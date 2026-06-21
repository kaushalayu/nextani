'use client'

export default function Error({ error, reset }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: 40, textAlign: 'center',
    }}>
      <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 48, color: '#ef4444', marginBottom: 16 }} />
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Something went wrong</h2>
      <p style={{ color: '#6b7280', marginBottom: 24, maxWidth: 400 }}>{error?.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} style={{
        padding: '12px 32px', background: '#6366f1', color: '#fff', border: 'none',
        borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14,
      }}>
        Try Again
      </button>
    </div>
  )
}
