import type { Patient } from '../types/patient'

export function filterPatientsByName(patients: Patient[], query: string): Patient[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return patients
  }

  return patients.filter((patient) => patient.name.toLowerCase().includes(normalizedQuery))
}
