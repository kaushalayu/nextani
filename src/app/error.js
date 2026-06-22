'use client'

export default function Error({ error, reset }) {
  return (
    <div className="error-page-con">
      <div className="error-page-inner">
        <i className="fa-solid fa-triangle-exclamation error-page-icon" />
        <h2 className="error-page-title">Something went wrong</h2>
        <p className="error-page-desc">{error?.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="error-page-btn">Try Again</button>
      </div>
    </div>
  )
}
