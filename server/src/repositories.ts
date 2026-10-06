import type { PrismaClient } from '@prisma/client'
import { AppError } from './errors.js'

export type SafeUser = { id: string; name: string; email: string }
export type StoredUser = SafeUser & { passwordHash: string }

export type PatientRecord = {
  id: string
  name: string
  gender: string
  age: number
  profilePicture: string
  dateOfBirth: string
  phoneNumber: string
  emergencyContact: string
  insuranceType: string
  diagnosisHistory: Array<{
    id: string
    position: number
    month: string
    year: number
    systolicValue: number
    systolicLevels: string
    diastolicValue: number
    diastolicLevels: string
    heartRateValue: number
    heartRateLevels: string
    respiratoryRateValue: number
    respiratoryRateLevels: string
    temperatureValue: number
    temperatureLevels: string
  }>
  diagnosticRecords: Array<{
    id: string
    name: string
    description: string
    status: string
    note: string | null
  }>
  labResults: Array<{ name: string }>
}

export type DiagnosticInput = {
  name: string
  description: string
  status: string
  note?: string | null
}

export type DiagnosticPatch = Partial<DiagnosticInput>

export interface UserRepository {
  findByEmail(email: string): Promise<StoredUser | null>
  findSafeById(id: string): Promise<SafeUser | null>
  create(name: string, email: string, passwordHash: string): Promise<SafeUser>
}

export interface PatientRepository {
  findAll(): Promise<PatientRecord[]>
  findById(id: string): Promise<PatientRecord | null>
  createDiagnostic(patientId: string, input: DiagnosticInput): Promise<PatientRecord['diagnosticRecords'][number]>
  updateDiagnostic(patientId: string, diagnosticId: string, input: DiagnosticPatch): Promise<PatientRecord['diagnosticRecords'][number] | null>
  deleteDiagnostic(patientId: string, diagnosticId: string): Promise<boolean>
}

const patientInclude = {
  diagnosisHistory: { orderBy: { position: 'asc' as const } },
  diagnosticRecords: { orderBy: { createdAt: 'asc' as const } },
  labResults: { orderBy: { name: 'asc' as const } },
}

export function createPrismaRepositories(prisma: PrismaClient): {
  users: UserRepository
  patients: PatientRepository
} {
  return {
    users: {
      async findByEmail(email) {
        return prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, passwordHash: true },
        })
      },
      async findSafeById(id) {
        return prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } })
      },
      async create(name, email, passwordHash) {
        return prisma.user.create({
          data: { name, email, passwordHash },
          select: { id: true, name: true, email: true },
        })
      },
    },
    patients: {
      async findAll() {
        return prisma.patient.findMany({ include: patientInclude, orderBy: { name: 'asc' } })
      },
      async findById(id) {
        return prisma.patient.findUnique({ where: { id }, include: patientInclude })
      },
      async createDiagnostic(patientId, input) {
        const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } })
        if (!patient) throw new AppError(404, 'Patient not found', 'PATIENT_NOT_FOUND')
        return prisma.diagnosticRecord.create({ data: { patientId, ...input } })
      },
      async updateDiagnostic(patientId, diagnosticId, input) {
        const result = await prisma.diagnosticRecord.updateMany({
          where: { id: diagnosticId, patientId },
          data: input,
        })
        if (result.count === 0) return null
        return prisma.diagnosticRecord.findUnique({ where: { id: diagnosticId } })
      },
      async deleteDiagnostic(patientId, diagnosticId) {
        const result = await prisma.diagnosticRecord.deleteMany({ where: { id: diagnosticId, patientId } })
        return result.count > 0
      },
    },
  }
}

export function serializeDiagnostic(
  record: PatientRecord['diagnosticRecords'][number],
) {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    status: record.status,
    note: record.note ?? undefined,
  }
}

export function serializePatient(patient: PatientRecord) {
  return {
    id: patient.id,
    name: patient.name,
    gender: patient.gender,
    age: patient.age,
    profilePicture: patient.profilePicture,
    dateOfBirth: patient.dateOfBirth,
    phoneNumber: patient.phoneNumber,
    emergencyContact: patient.emergencyContact,
    insuranceType: patient.insuranceType,
    diagnosisHistory: patient.diagnosisHistory.map((entry) => ({
      id: entry.id,
      month: entry.month,
      year: entry.year,
      bloodPressure: {
        systolic: { value: entry.systolicValue, levels: entry.systolicLevels },
        diastolic: { value: entry.diastolicValue, levels: entry.diastolicLevels },
      },
      heartRate: { value: entry.heartRateValue, levels: entry.heartRateLevels },
      respiratoryRate: { value: entry.respiratoryRateValue, levels: entry.respiratoryRateLevels },
      temperature: { value: entry.temperatureValue, levels: entry.temperatureLevels },
    })),
    diagnosticList: patient.diagnosticRecords.map(serializeDiagnostic),
    labResults: patient.labResults.map((result) => result.name),
  }
}
