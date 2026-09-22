import { useQuery } from '@tanstack/react-query'
import { fetchPatients } from '../../shared/api/patients'
import { patientQueryKeys } from './patientQueryKeys'

export function usePatientsQuery() {
  return useQuery({
    queryKey: patientQueryKeys.all,
    queryFn: ({ signal }) => fetchPatients(signal),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
