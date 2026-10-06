import { toPatient } from './adapters'
import { ApiError, apiGet } from './http'
import { patientsResponseSchema } from './schemas'
import type { Patient } from '../../types/patient'

export async function fetchPatients(signal?: AbortSignal): Promise<Patient[]> {
  const raw = await apiGet<unknown>('/api/patients', signal)
  const parsed = patientsResponseSchema.safeParse(raw)

  if (!parsed.success) {
    throw new ApiError(422, 'Patients payload failed runtime validation')
  }

  return parsed.data.map(toPatient)
}
