"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("logistics-auth")
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed.user || null)
        setToken(parsed.token || null)
      }
    } catch {}
    setIsLoading(false)
  }, [])

  const persist = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem("logistics-auth", JSON.stringify({ user: nextUser, token: nextToken }))
  }

  const clearSession = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("logistics-auth")
  }

  const login = async (email, password, role) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: email, password }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Login failed' }))
        setIsLoading(false)
        return { success: false, error: errorData }
      }
      const data = await res.json()
      console.log("[DEBUG] login: API user role:", data?.user?.role, "Expected role:", role)
      // Map to UI shape (ensure name exists for header display)
      const uiUser = {
        id: data.user.id || data.user._id || data.user.sub || data.user.userId,
        email: data.user.email,
        username: data.user.username,
        name: data.user.username || data.user.email?.split("@")[0],
        role: data.user.role || role || "user",
      }
      persist(uiUser, data.token)
      setIsLoading(false)
      return { success: true, user: uiUser }
    } catch (e) {
      setIsLoading(false)
      return { success: false, error: { message: 'Network error. Please try again.' } }
    }
  }

  const register = async (formData, role) => {
    setIsLoading(true)
    try {
      // Derive a username if not provided by UI
      const derivedUsername = (formData.firstName && formData.lastName)
        ? `${formData.firstName}.${formData.lastName}`.toLowerCase().replace(/\s+/g, "")
        : (formData.email?.split("@")[0] || `user${Date.now()}`)

      const payload = {
        username: derivedUsername,
        email: formData.email,
        password: formData.password,
        role,
      }
      if (role === "admin") {
        payload.adminCode = formData.adminCode
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        setIsLoading(false)
        return false
      }

      // Auto-login after successful registration (backend doesn't return token on register)
      const loginResult = await login(formData.email, formData.password, role)
      setIsLoading(false)
      return loginResult.success ? loginResult.user : false
    } catch (e) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
