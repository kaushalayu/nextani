'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import API from '../lib/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('painomed_token', data.token)
      localStorage.setItem('painomed_user', JSON.stringify(data.user))
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
    localStorage.removeItem('painomed_token')
    localStorage.removeItem('painomed_user')
    setUser(null)
  }, [])

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('painomed_token')
      if (!token) { setUser(null); return }
      const { data } = await API.get('/auth/me')
      if (data.success && data.user) {
        localStorage.setItem('painomed_user', JSON.stringify(data.user))
        setUser(data.user)
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, isAdmin, loading, error, login, logout, refreshUser,
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
