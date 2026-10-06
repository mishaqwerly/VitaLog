import { useQuery } from '@tanstack/react-query'
import { fetchAppointments } from '../../shared/api/appointments'
import { appointmentQueryKeys } from './appointmentQueryKeys'

export function useAppointmentsQuery() {
  return useQuery({
    queryKey: appointmentQueryKeys.all,
    queryFn: ({ signal }) => fetchAppointments(signal),
    refetchInterval: 8_000,
  })
}
