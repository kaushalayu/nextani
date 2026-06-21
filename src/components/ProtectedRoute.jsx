'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null
  return children
}

export function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
    else if (!isAdmin) router.replace('/')
  }, [isLoggedIn, isAdmin, router])

  if (!isLoggedIn || !isAdmin) return null
  return children
}
