import 'dotenv/config'
import { z } from 'zod'

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65_535).default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
  AUTH_COOKIE_NAME: z.string().min(1).default('techcare_token'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
})

const importerEnvSchema = baseEnvSchema.extend({
  COALITION_API_URL: z.url().default('https://fedskillstest.coalitiontechnologies.workers.dev/'),
  COALITION_API_USERNAME: z.string().min(1),
  COALITION_API_PASSWORD: z.string().min(1),
})

export type AppConfig = {
  nodeEnv: 'development' | 'test' | 'production'
  port: number
  databaseUrl: string
  jwtSecret: string
  jwtExpiresIn: string
  authCookieName: string
  corsOrigins: string[]
}

function formatEnvError(error: z.ZodError): Error {
  const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
  return new Error(`Invalid environment configuration: ${issues}`)
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = baseEnvSchema.safeParse(environment)
  if (!result.success) throw formatEnvError(result.error)

  return {
    nodeEnv: result.data.NODE_ENV,
    port: result.data.PORT,
    databaseUrl: result.data.DATABASE_URL,
    jwtSecret: result.data.JWT_SECRET,
    jwtExpiresIn: result.data.JWT_EXPIRES_IN,
    authCookieName: result.data.AUTH_COOKIE_NAME,
    corsOrigins: result.data.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
  }
}

export function loadImporterConfig(environment: NodeJS.ProcessEnv = process.env) {
  const result = importerEnvSchema.safeParse(environment)
  if (!result.success) throw formatEnvError(result.error)

  return {
    ...loadConfig(environment),
    coalitionApiUrl: result.data.COALITION_API_URL,
    coalitionApiUsername: result.data.COALITION_API_USERNAME,
    coalitionApiPassword: result.data.COALITION_API_PASSWORD,
  }
}
