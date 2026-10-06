import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import {
  fetchCurrentUser,
  login,
  logout,
  register,
  type AuthUser,
} from '../shared/api/auth'

type AuthContextValue = {
  user: AuthUser | null
  isPending: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const authQueryKey = ['auth', 'me'] as const
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const authQuery = useQuery({
    queryKey: authQueryKey,
    queryFn: ({ signal }) => fetchCurrentUser(signal),
    staleTime: 5 * 60_000,
    retry: false,
  })

  const setUser = (user: AuthUser | null) => {
    queryClient.setQueryData(authQueryKey, user)
  }

  const handleLogin = async (email: string, password: string) => {
    setUser(await login({ email, password }))
  }

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setUser(await register({ name, email, password }))
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
    queryClient.removeQueries({ queryKey: ['patients'] })
  }

  return (
    <AuthContext.Provider
      value={{
        user: authQuery.data ?? null,
        isPending: authQuery.isPending,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
