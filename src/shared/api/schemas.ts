import { z } from 'zod'

const vitalLevelSchema = z.object({
  value: z.number(),
  levels: z.string(),
})

const diagnosisEntryDtoSchema = z.object({
  month: z.string(),
  year: z.number(),
  blood_pressure: z.object({
    systolic: vitalLevelSchema,
    diastolic: vitalLevelSchema,
  }),
  heart_rate: vitalLevelSchema,
  respiratory_rate: vitalLevelSchema,
  temperature: vitalLevelSchema,
})

const diagnosticItemDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.string(),
})

export const patientDtoSchema = z.object({
  name: z.string(),
  gender: z.enum(['Female', 'Male']),
  age: z.number(),
  profile_picture: z.string(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  emergency_contact: z.string(),
  insurance_type: z.string(),
  diagnosis_history: z.array(diagnosisEntryDtoSchema),
  diagnostic_list: z.array(diagnosticItemDtoSchema),
  lab_results: z.array(z.string()),
})

export const patientsResponseSchema = z.array(patientDtoSchema)

export type PatientDto = z.infer<typeof patientDtoSchema>
