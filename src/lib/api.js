import axios from 'axios'

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  timeout: 15000,
})

API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('painomed_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('painomed_token')
      localStorage.removeItem('painomed_user')
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/join-now'
      if (!isAuthRoute) {
        const redirectTo = isAdminRoute ? '/login' : `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        window.location.href = redirectTo
      }
    }
    return Promise.reject(error)
  }
)

export default API
