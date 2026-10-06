import { ApiError, apiGet, apiRequest } from './http'

export type AuthUser = {
  id: string
  email: string
  name: string
}

type AuthCredentials = {
  email: string
  password: string
}

type AuthResponse = {
  user: AuthUser
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<AuthUser | null> {
  try {
    const response = await apiGet<AuthResponse>('/api/auth/me', signal)
    return response.user
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

export async function login(credentials: AuthCredentials): Promise<AuthUser> {
  const response = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })
  return response.user
}

export async function register(
  credentials: AuthCredentials & { name: string },
): Promise<AuthUser> {
  const response = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: credentials,
  })
  return response.user
}

export function logout(): Promise<void> {
  return apiRequest<void>('/api/auth/logout', { method: 'POST' })
}
