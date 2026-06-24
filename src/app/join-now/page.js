'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import { useToast } from '../../components/Toast'
import SubBanner from '../../components/SubBanner'

export default function JoinNow() {
  usePageMetaFromAdmin('/join', 'Create Account', 'Join Painomed today and enjoy fast, reliable medicine delivery.')

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
    <>
      <SubBanner title="Create Account" description="Join Painomed today and enjoy fast, reliable medicine delivery." page="Register" />
      <div className="join-page">
        <div className="container">
          <div className="join-form-card">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
              <div className="join-form-group">
                <label>Full Name</label>
                <input type="text" className="join-form-input" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="join-form-group">
                <label>Email</label>
                <input type="email" className="join-form-input" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="join-form-group">
                <label>Password</label>
                <input type="password" className="join-form-input" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
              <button type="submit" className="join-submit-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </button>
              <p className="join-login-link">
                Already have an account? <Link href="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
