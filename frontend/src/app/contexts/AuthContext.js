"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { loginUser, signupUser } from '../server/operations/authAPI.js'
import { logout } from './authUtils.js' // simple logout

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check localStorage on mount
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      if (savedToken && savedUser) {
        setToken(JSON.parse(savedToken))
        setUser(JSON.parse(savedUser))
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, navigateTo = '/dashboard') => {
    const toastId = toast.loading('Logging in...')
    setLoading(true)
    try {
      const result = await loginUser({ email, password })
      if (!result.success) throw new Error(result.error)

      const { token, user } = result.data
      localStorage.setItem('token', JSON.stringify(token))
      localStorage.setItem('user', JSON.stringify(user))
      setToken(token)
      setUser(user)
      toast.success('Login successful')
      router.push(navigateTo)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }

const signup = async (userData, navigateTo = '/dashboard') => {
    const toastId = toast.loading('Creating account...')
    setLoading(true)
    try {
      const result = await signupUser(userData)
      if (!result.success) throw new Error(result.error)

      const { token, user } = result.data
      localStorage.setItem('token', JSON.stringify(token))
      localStorage.setItem('user', JSON.stringify(user))
      setToken(token)
      setUser(user)
      toast.success('Account created! Auto-logged in')
      router.push(navigateTo)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out')
    router.push('/')
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
