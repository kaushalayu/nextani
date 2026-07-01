'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import { useToast } from '../../components/Toast'
import SubBanner from '../../components/SubBanner'

export default function Login() {
  usePageMetaFromAdmin('/login', 'Login', 'Sign in to your Painomed account to manage orders and more.')

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
    <>
      <SubBanner title="Login" description="Sign in to your Painomed account to manage orders and more." page="Login" />
      <div className="login-page">
        <div className="login-form-box">
          <div className="login-form-title">
            <img src="/logo.png" alt="Painomed" />
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="login-card">
            <div className="form-group">
              <div className="input-icon-wrap">
                <i className="fa-regular fa-envelope" />
                <input type="email" className="input-field" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <div className="input-icon-wrap">
                <i className="fa-solid fa-lock" />
                <input type="password" className="input-field" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            <div className="login-extra">
              <label><input type="checkbox" defaultChecked /> Remember me</label>
              <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
            </div>
            <div className="join-now-outer">
              Don&apos;t have an account? <Link href="/join-now">Join Now</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
