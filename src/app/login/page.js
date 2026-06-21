'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      addToast('Login successful!', 'success')
      const redirect = searchParams.get('redirect') || (result.role === 'admin' ? '/admin' : '/')
      router.push(redirect)
    } else {
      addToast(result.message, 'error')
    }
  }

  return (
    <div className="login-page">
      <div className="container" style={{ padding: '60px 0', maxWidth: 450, margin: '0 auto' }}>
        <h1 className="text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center mt-3">
            Don't have an account? <Link href="/join-now">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
