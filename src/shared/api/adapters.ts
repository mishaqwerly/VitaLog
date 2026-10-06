import type { PatientDto } from './schemas'
import type { Patient } from '../../types/patient'

export function toPatient(dto: PatientDto): Patient {
  return dto
}
