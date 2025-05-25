import React, { createContext, useContext, useEffect, useState } from 'react'
import { me } from '@/api/auth'

const AuthorizeContext = createContext({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  hasPermission: () => false
})

export const AuthorizeProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAuthUser = async () => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const data = await me()
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch user', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthUser()
  }, [])

  const hasPermission = (permission, mode = 'every') => {
    if (!user?.permissions) return false

    if (Array.isArray(permission)) {
      return mode === 'every' ? permission.every((p) => user.permissions.includes(p)) : permission.some((p) => user.permissions.includes(p))
    }

    return user.permissions.includes(permission)
  }

  const isLoggedIn = Boolean(user)

  return <AuthorizeContext.Provider value={{ user, hasPermission, isLoading, isLoggedIn }}>{children}</AuthorizeContext.Provider>
}

export const useAuthorize = () => {
  const context = useContext(AuthorizeContext)
  if (!context) {
    throw new Error('useAuthorize must be used within an AuthorizeProvider')
  }
  return context
}
