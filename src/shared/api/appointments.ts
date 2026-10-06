import { z } from 'zod'
import { examTypes, type Appointment, type CreateAppointmentInput } from '../../types/appointment'
import { apiGet, apiRequest } from './http'

const appointmentSchema = z.object({
  id: z.string().uuid(),
  patientName: z.string(),
  phone: z.string(),
  examType: z.enum(examTypes),
  scheduledAt: z.string(),
  note: z.string().optional(),
  createdAt: z.string(),
})

export async function createClinicAppointment(
  input: CreateAppointmentInput,
): Promise<Appointment> {
  const raw = await apiRequest<unknown>('/api/clinic/appointments', {
    method: 'POST',
    body: input,
  })
  return appointmentSchema.parse(raw)
}

export async function fetchAppointments(signal?: AbortSignal): Promise<Appointment[]> {
  const raw = await apiGet<unknown>('/api/appointments', signal)
  return z.array(appointmentSchema).parse(raw)
}
