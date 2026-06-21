'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-wrapper">
        {toasts.map(t => (
          <div key={t.id} className={`toast-pill toast-pill--${t.type}`}>
            <span className="toast-pill__icon">
              {t.type === 'success' && <i className="fa-solid fa-circle-check" />}
              {t.type === 'wishlist' && <i className="fa-solid fa-heart" />}
              {t.type === 'cart' && <i className="fa-solid fa-cart-plus" />}
              {t.type === 'error' && <i className="fa-solid fa-circle-xmark" />}
              {t.type === 'info' && <i className="fa-solid fa-circle-info" />}
              {!['success','wishlist','cart','error','info'].includes(t.type) && <i className="fa-solid fa-circle-check" />}
            </span>
            <span className="toast-pill__msg">{t.message}</span>
            <button className="toast-pill__close" onClick={() => removeToast(t.id)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
