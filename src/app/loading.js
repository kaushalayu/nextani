export default function Loading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: 40,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, border: '4px solid #e5e7eb',
          borderTopColor: '#6366f1', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', margin: '0 auto 16px',
        }} />
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  )
}
