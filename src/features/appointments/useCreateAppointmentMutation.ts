import { useMutation } from '@tanstack/react-query'
import { createClinicAppointment } from '../../shared/api/appointments'
import type { CreateAppointmentInput } from '../../types/appointment'

export function useCreateAppointmentMutation() {
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => createClinicAppointment(input),
  })
}
