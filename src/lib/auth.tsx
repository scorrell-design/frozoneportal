/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Persona, Role } from './types'
import { PERSONAS } from '../data/seed'

interface AuthState {
  persona: Persona | null
  login: (role: Role) => Persona
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)
const KEY = 'frozone.role'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona | null>(() => {
    const saved = localStorage.getItem(KEY)
    return PERSONAS.find((p) => p.role === saved) ?? null
  })

  const login = useCallback((role: Role) => {
    const p = PERSONAS.find((x) => x.role === role)!
    localStorage.setItem(KEY, role)
    setPersona(p)
    return p
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(KEY)
    setPersona(null)
  }, [])

  const value = useMemo(() => ({ persona, login, logout }), [persona, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
