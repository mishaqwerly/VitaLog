import { z } from 'zod'

const vitalLevelSchema = z.object({
  value: z.number(),
  levels: z.string(),
})

const diagnosisHistorySchema = z.object({
  month: z.string(),
  year: z.number(),
  bloodPressure: z.object({
    systolic: vitalLevelSchema,
    diastolic: vitalLevelSchema,
  }),
  heartRate: vitalLevelSchema,
  respiratoryRate: vitalLevelSchema,
  temperature: vitalLevelSchema,
})

export const diagnosticRecordSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  note: z.string().optional(),
})

export const patientDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  gender: z.enum(['Female', 'Male']),
  age: z.number(),
  profilePicture: z.string(),
  dateOfBirth: z.string(),
  phoneNumber: z.string(),
  emergencyContact: z.string(),
  insuranceType: z.string(),
  diagnosisHistory: z.array(diagnosisHistorySchema),
  diagnosticList: z.array(diagnosticRecordSchema),
  labResults: z.array(z.string()),
})

export const patientsResponseSchema = z.array(patientDtoSchema)

export type PatientDto = z.infer<typeof patientDtoSchema>
