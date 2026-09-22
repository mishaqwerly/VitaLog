export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getAuthHeader(): string {
  const user = import.meta.env.VITE_API_USER
  const password = import.meta.env.VITE_API_PASSWORD
  return `Basic ${btoa(`${user}:${password}`)}`
}

export async function apiGet<T>(signal?: AbortSignal): Promise<T> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    headers: {
      Authorization: getAuthHeader(),
    },
    signal,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}
