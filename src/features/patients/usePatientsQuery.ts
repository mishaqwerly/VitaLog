import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { fetchPatients } from '../../shared/api/patients'
import { patientQueryKeys } from './patientQueryKeys'

export function usePatientsQuery() {
  const { user } = useAuth()

  return useQuery({
    queryKey: patientQueryKeys.all,
    queryFn: ({ signal }) => fetchPatients(signal),
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
