'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import API from '../lib/api'

const AuthContext = createContext()

const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem('pharmez_user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const getStoredToken = () => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('pharmez_token') || null
  } catch {
    return null
  }
}

const safeLocalStorage = {
  getItem: (key) => { try { return typeof window !== 'undefined' ? localStorage.getItem(key) : null } catch { return null } },
  setItem: (key, val) => { try { if (typeof window !== 'undefined') localStorage.setItem(key, val) } catch {} },
  removeItem: (key) => { try { if (typeof window !== 'undefined') localStorage.removeItem(key) } catch {} },
}

const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'

  const clearAuth = useCallback(() => {
    safeLocalStorage.removeItem('pharmez_token')
    safeLocalStorage.removeItem('pharmez_user')
    setUser(null)
  }, [])

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      clearAuth()
      setAuthChecked(true)
      return
    }
    if (isTokenExpired(token)) {
      clearAuth()
      setAuthChecked(true)
      return
    }
    API.get('/auth/me')
      .then(({ data }) => {
        if (data.success && data.user) {
          localStorage.setItem('pharmez_user', JSON.stringify(data.user))
          setUser(data.user)
        } else {
          clearAuth()
        }
      })
      .catch(() => clearAuth())
      .finally(() => setAuthChecked(true))
  }, [clearAuth])

  const register = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API.post('/auth/register', { name, email, password })
      safeLocalStorage.setItem('pharmez_token', data.token)
      safeLocalStorage.setItem('pharmez_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      safeLocalStorage.setItem('pharmez_token', data.token)
      safeLocalStorage.setItem('pharmez_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, role: data.user.role }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(() => {
    clearAuth()
  }, [clearAuth])

  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me')
      if (data.success && data.user) {
        localStorage.setItem('pharmez_user', JSON.stringify(data.user))
        setUser(data.user)
      } else {
        clearAuth()
      }
    } catch {
      clearAuth()
    }
  }

  if (!authChecked) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#f0f2f7',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid #e2e8f0',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            margin: '0 auto 12px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, isAdmin, loading, error, register, login, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
