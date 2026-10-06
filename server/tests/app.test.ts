import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { AppError } from '../src/errors.js'
import type { AppConfig } from '../src/config.js'
import type {
  DiagnosticInput,
  DiagnosticPatch,
  PatientRecord,
  PatientRepository,
  StoredUser,
  UserRepository,
} from '../src/repositories.js'

const config: AppConfig = {
  nodeEnv: 'test',
  port: 4000,
  databaseUrl: 'postgresql://unused',
  jwtSecret: 'test-secret-that-is-at-least-thirty-two-characters',
  jwtExpiresIn: '1d',
  authCookieName: 'test_token',
  corsOrigins: ['http://localhost:5173'],
}

function createRepositories() {
  const usersByEmail = new Map<string, StoredUser>()
  const patientId = randomUUID()
  const diagnosticId = randomUUID()
  const patient: PatientRecord = {
    id: patientId,
    name: 'Jessica Taylor',
    gender: 'Female',
    age: 28,
    profilePicture: 'https://example.com/jessica.png',
    dateOfBirth: '08/23/1996',
    phoneNumber: '(415) 555-1234',
    emergencyContact: 'Jordan Taylor',
    insuranceType: 'Sunrise Health Assurance',
    diagnosisHistory: [{
      id: randomUUID(),
      position: 0,
      month: 'March',
      year: 2024,
      systolicValue: 160,
      systolicLevels: 'Higher than Average',
      diastolicValue: 78,
      diastolicLevels: 'Lower than Average',
      heartRateValue: 78,
      heartRateLevels: 'Normal',
      respiratoryRateValue: 20,
      respiratoryRateLevels: 'Normal',
      temperatureValue: 98.6,
      temperatureLevels: 'Normal',
    }],
    diagnosticRecords: [{
      id: diagnosticId,
      name: 'Hypertension',
      description: 'Chronic high blood pressure',
      status: 'Under Observation',
      note: null,
    }],
    labResults: [{ name: 'Blood Tests' }],
  }

  const users: UserRepository = {
    async findByEmail(email) {
      return usersByEmail.get(email) ?? null
    },
    async findSafeById(id) {
      const user = [...usersByEmail.values()].find((candidate) => candidate.id === id)
      return user ? { id: user.id, name: user.name, email: user.email } : null
    },
    async create(name, email, passwordHash) {
      const user = { id: randomUUID(), name, email, passwordHash }
      usersByEmail.set(email, user)
      return { id: user.id, name: user.name, email: user.email }
    },
  }

  const patients: PatientRepository = {
    async findAll() {
      return [patient]
    },
    async findById(id) {
      return id === patient.id ? patient : null
    },
    async createDiagnostic(id: string, input: DiagnosticInput) {
      if (id !== patient.id) throw new AppError(404, 'Patient not found', 'PATIENT_NOT_FOUND')
      const record = { id: randomUUID(), ...input, note: input.note ?? null }
      patient.diagnosticRecords.push(record)
      return record
    },
    async updateDiagnostic(id: string, recordId: string, input: DiagnosticPatch) {
      if (id !== patient.id) return null
      const record = patient.diagnosticRecords.find((item) => item.id === recordId)
      if (!record) return null
      Object.assign(record, input)
      return record
    },
    async deleteDiagnostic(id: string, recordId: string) {
      if (id !== patient.id) return false
      const index = patient.diagnosticRecords.findIndex((item) => item.id === recordId)
      if (index < 0) return false
      patient.diagnosticRecords.splice(index, 1)
      return true
    },
  }

  return { users, patients, patientId, diagnosticId }
}

describe('API', () => {
  it('reports health without a database or authentication', async () => {
    const repositories = createRepositories()
    const response = await request(createApp({ config, ...repositories })).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })

  it('guards patient routes', async () => {
    const repositories = createRepositories()
    const response = await request(createApp({ config, ...repositories })).get('/api/patients')
    expect(response.status).toBe(401)
    expect(response.body.error.code).toBe('UNAUTHORIZED')
  })

  it('validates auth payloads before repository access', async () => {
    const repositories = createRepositories()
    const response = await request(createApp({ config, ...repositories }))
      .post('/api/auth/register')
      .send({ name: '', email: 'not-an-email', password: 'short' })
    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('registers, authenticates, and returns frontend-compatible patients', async () => {
    const repositories = createRepositories()
    const agent = request.agent(createApp({ config, ...repositories }))

    const register = await agent
      .post('/api/auth/register')
      .send({ name: 'Doctor Example', email: 'Doctor@Example.com', password: 'secure-password' })
    expect(register.status).toBe(201)
    expect(register.headers['set-cookie']?.[0]).toContain('HttpOnly')

    const me = await agent.get('/api/auth/me')
    expect(me.status).toBe(200)
    expect(me.body.user.email).toBe('doctor@example.com')

    const response = await agent.get('/api/patients')
    expect(response.status).toBe(200)
    expect(response.body[0]).toMatchObject({
      id: repositories.patientId,
      profilePicture: 'https://example.com/jessica.png',
      diagnosisHistory: [{ bloodPressure: { systolic: { value: 160 } } }],
      diagnosticList: [{ id: repositories.diagnosticId }],
      labResults: ['Blood Tests'],
    })
  })

  it('rejects invalid diagnostic writes', async () => {
    const repositories = createRepositories()
    const agent = request.agent(createApp({ config, ...repositories }))
    await agent.post('/api/auth/register').send({
      name: 'Doctor Example',
      email: 'doctor@example.com',
      password: 'secure-password',
    })

    const response = await agent
      .post(`/api/patients/${repositories.patientId}/diagnostics`)
      .send({ name: '', description: 'x', status: 'Active', unexpected: true })
    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('logs in, writes diagnostics, and logs out', async () => {
    const repositories = createRepositories()
    const agent = request.agent(createApp({ config, ...repositories }))

    await agent.post('/api/auth/register').send({
      name: 'Doctor Example',
      email: 'doctor@example.com',
      password: 'secure-password',
    })
    await agent.post('/api/auth/logout')

    const login = await agent.post('/api/auth/login').send({
      email: 'doctor@example.com',
      password: 'secure-password',
    })
    expect(login.status).toBe(200)
    expect(login.body.user.email).toBe('doctor@example.com')

    const created = await agent
      .post(`/api/patients/${repositories.patientId}/diagnostics`)
      .send({
        name: 'Migraine',
        description: 'Recurrent severe headache with nausea',
        status: 'Under Observation',
      })
    expect(created.status).toBe(201)
    expect(created.body).toMatchObject({
      name: 'Migraine',
      status: 'Under Observation',
    })
    expect(created.body.id).toEqual(expect.any(String))
    expect(created.body.patientId).toBeUndefined()

    const patched = await agent
      .patch(`/api/patients/${repositories.patientId}/diagnostics/${created.body.id}`)
      .send({ status: 'Cured' })
    expect(patched.status).toBe(200)
    expect(patched.body.status).toBe('Cured')

    const deleted = await agent.delete(
      `/api/patients/${repositories.patientId}/diagnostics/${created.body.id}`,
    )
    expect(deleted.status).toBe(204)

    await agent.post('/api/auth/logout')
    const guarded = await agent.get('/api/patients')
    expect(guarded.status).toBe(401)
  })
})
