import type { Patient } from '../../types/patient'
import { usePatientsQuery } from './usePatientsQuery'

type SelectedPatientResult = ReturnType<typeof usePatientsQuery> & {
  patients: Patient[]
  patient: Patient | null
  effectiveSelectedId: string | null
}

export function useSelectedPatient(selectedPatientId: string | null): SelectedPatientResult {
  const query = usePatientsQuery()
  const patients = query.data ?? []
  const effectiveSelectedId = selectedPatientId ?? patients[0]?.id ?? null
  const patient = patients.find((item) => item.id === effectiveSelectedId) ?? null

  return {
    ...query,
    patients,
    patient,
    effectiveSelectedId,
  }
}
