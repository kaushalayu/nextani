'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'

export default function JoinNow() {
  const router = useRouter()
  const { register } = useAuth()
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await register(name, email, password)
    setLoading(false)
    if (result.success) {
      addToast('Registration successful!', 'success')
      router.push('/')
    } else {
      addToast(result.message, 'error')
    }
  }

  return (
    <div className="join-page">
      <div className="container" style={{ padding: '60px 0', maxWidth: 450, margin: '0 auto' }}>
        <h1 className="text-center mb-4">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <p className="text-center mt-3">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
