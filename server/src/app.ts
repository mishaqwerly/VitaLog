import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { z } from 'zod'
import type { AppConfig } from './config.js'
import { clearAuthCookie, createRequireAuth, hashPassword, setAuthCookie, signAuthToken, verifyPassword } from './auth.js'
import { AppError, errorHandler, notFound } from './errors.js'
import type { AppointmentRepository, DiagnosticInput, DiagnosticPatch, PatientRepository, UserRepository } from './repositories.js'
import { serializeAppointment, serializeDiagnostic, serializePatient } from './repositories.js'
import {
  createAppointmentSchema,
  createDiagnosticSchema,
  diagnosticParamsSchema,
  examTypes,
  loginSchema,
  patientIdSchema,
  registerSchema,
  updateDiagnosticSchema,
} from './schemas.js'

export type AppDependencies = {
  config: AppConfig
  users: UserRepository
  patients: PatientRepository
  appointments: AppointmentRepository
}

function withoutUndefined<T extends object>(value: T): { [K in keyof T]?: Exclude<T[K], undefined> } {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as {
    [K in keyof T]?: Exclude<T[K], undefined>
  }
}

export function createApp({ config, users, patients, appointments }: AppDependencies) {
  const app = express()
  const requireAuth = createRequireAuth(config)

  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      if (
        config.nodeEnv !== 'production' &&
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
      ) {
        callback(null, true)
        return
      }
      callback(new AppError(403, 'Origin is not allowed by CORS', 'CORS_FORBIDDEN'))
    },
  }))
  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  app.get('/api/clinic', (_request, response) => {
    response.json({
      name: 'VitaLog Clinic Wrocław',
      examTypes: [...examTypes],
    })
  })

  app.post('/api/clinic/appointments', async (request, response) => {
    const input = createAppointmentSchema.parse(request.body)
    const created = await appointments.create({
      patientName: input.patientName,
      phone: input.phone,
      examType: input.examType,
      scheduledAt: new Date(input.scheduledAt),
      ...(input.note === undefined ? {} : { note: input.note }),
    })
    response.status(201).json(serializeAppointment(created))
  })

  app.get('/api/appointments', requireAuth, async (_request, response) => {
    response.json((await appointments.findAll()).map(serializeAppointment))
  })

  app.post('/api/auth/register', async (request, response) => {
    const input = registerSchema.parse(request.body)
    if (await users.findByEmail(input.email)) {
      throw new AppError(409, 'An account with this email already exists', 'EMAIL_TAKEN')
    }

    const user = await users.create(input.name, input.email, await hashPassword(input.password))
    setAuthCookie(response, signAuthToken(user.id, config), config)
    response.status(201).json({ user })
  })

  app.post('/api/auth/login', async (request, response) => {
    const input = loginSchema.parse(request.body)
    const user = await users.findByEmail(input.email)
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS')
    }

    setAuthCookie(response, signAuthToken(user.id, config), config)
    response.json({ user: { id: user.id, name: user.name, email: user.email } })
  })

  app.post('/api/auth/logout', (_request, response) => {
    clearAuthCookie(response, config)
    response.status(204).send()
  })

  app.get('/api/auth/me', requireAuth, async (request, response) => {
    const user = await users.findSafeById(request.userId!)
    if (!user) throw new AppError(401, 'Session user no longer exists', 'UNAUTHORIZED')
    response.json({ user })
  })

  app.get('/api/patients', requireAuth, async (_request, response) => {
    response.json((await patients.findAll()).map(serializePatient))
  })

  app.get('/api/patients/:patientId', requireAuth, async (request, response) => {
    const { patientId } = patientIdSchema.parse(request.params)
    const patient = await patients.findById(patientId)
    if (!patient) throw new AppError(404, 'Patient not found', 'PATIENT_NOT_FOUND')
    response.json(serializePatient(patient))
  })

  app.post('/api/patients/:patientId/diagnostics', requireAuth, async (request, response) => {
    const { patientId } = patientIdSchema.parse(request.params)
    const input = withoutUndefined(createDiagnosticSchema.parse(request.body)) as DiagnosticInput
    const created = await patients.createDiagnostic(patientId, input)
    response.status(201).json(serializeDiagnostic(created))
  })

  const updateDiagnostic = async (patientId: string, diagnosticId: string, body: unknown) => {
    const input = withoutUndefined(updateDiagnosticSchema.parse(body)) as DiagnosticPatch
    const diagnostic = await patients.updateDiagnostic(patientId, diagnosticId, input)
    if (!diagnostic) throw new AppError(404, 'Diagnostic record not found', 'DIAGNOSTIC_NOT_FOUND')
    return serializeDiagnostic(diagnostic)
  }

  app.patch('/api/patients/:patientId/diagnostics/:diagnosticId', requireAuth, async (request, response) => {
    const ids = diagnosticParamsSchema.parse(request.params)
    response.json(await updateDiagnostic(ids.patientId, ids.diagnosticId, request.body))
  })

  app.delete('/api/patients/:patientId/diagnostics/:diagnosticId', requireAuth, async (request, response) => {
    const { patientId, diagnosticId } = diagnosticParamsSchema.parse(request.params)
    if (!(await patients.deleteDiagnostic(patientId, diagnosticId))) {
      throw new AppError(404, 'Diagnostic record not found', 'DIAGNOSTIC_NOT_FOUND')
    }
    response.status(204).send()
  })

  const collectionUpdateSchema = updateDiagnosticSchema.and(z.object({ id: z.uuid() }))
  app.patch('/api/patients/:patientId/diagnostics', requireAuth, async (request, response) => {
    const { patientId } = patientIdSchema.parse(request.params)
    const { id, ...input } = collectionUpdateSchema.parse(request.body)
    response.json(await updateDiagnostic(patientId, id, input))
  })

  app.delete('/api/patients/:patientId/diagnostics', requireAuth, async (request, response) => {
    const { patientId } = patientIdSchema.parse(request.params)
    const { id } = z.object({ id: z.uuid() }).parse(request.query)
    if (!(await patients.deleteDiagnostic(patientId, id))) {
      throw new AppError(404, 'Diagnostic record not found', 'DIAGNOSTIC_NOT_FOUND')
    }
    response.status(204).send()
  })

  app.use(notFound)
  app.use(errorHandler)
  return app
}
