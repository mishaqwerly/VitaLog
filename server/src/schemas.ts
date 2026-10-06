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

export const examTypes = [
  'Blood Tests',
  'CT Scan',
  'MRI',
  'Ultrasound',
  'ECG',
  'General Checkup',
] as const

export const createAppointmentSchema = z.object({
  patientName: trimmedText(120),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{6,32}$/, 'Enter a valid phone number'),
  examType: z.enum(examTypes),
  scheduledAt: z.iso.datetime(),
  note: z.string().trim().max(500).optional(),
}).strict().refine(
  (data) => new Date(data.scheduledAt).getTime() > Date.now() - 60_000,
  { message: 'Choose a future date and time', path: ['scheduledAt'] },
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
