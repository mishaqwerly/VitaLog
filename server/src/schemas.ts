import { z } from 'zod'

const trimmedText = (max: number) => z.string().trim().min(1).max(max)

export const loginSchema = z.object({
  email: z.email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128),
}).strict()

export const registerSchema = loginSchema.extend({
  name: trimmedText(120),
})

export const patientIdSchema = z.object({
  patientId: z.uuid(),
}).strict()

export const diagnosticParamsSchema = z.object({
  patientId: z.uuid(),
  diagnosticId: z.uuid(),
}).strict()

export const createDiagnosticSchema = z.object({
  name: trimmedText(160),
  description: trimmedText(2_000),
  status: trimmedText(80),
  note: z.string().trim().max(2_000).nullable().optional(),
}).strict()

export const updateDiagnosticSchema = createDiagnosticSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' },
)

const vitalSchema = z.object({
  value: z.number(),
  levels: z.string(),
})

const coalitionDiagnosisSchema = z.object({
  month: z.string(),
  year: z.number().int(),
  blood_pressure: z.object({
    systolic: vitalSchema,
    diastolic: vitalSchema,
  }),
  heart_rate: vitalSchema,
  respiratory_rate: vitalSchema,
  temperature: vitalSchema,
})

const coalitionDiagnosticSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.string(),
})

export const coalitionPatientsSchema = z.array(z.object({
  name: z.string(),
  gender: z.string(),
  age: z.number().int(),
  profile_picture: z.string(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  emergency_contact: z.string(),
  insurance_type: z.string(),
  diagnosis_history: z.array(coalitionDiagnosisSchema),
  diagnostic_list: z.array(coalitionDiagnosticSchema),
  lab_results: z.array(z.string()),
}))

export type CoalitionPatient = z.infer<typeof coalitionPatientsSchema>[number]
