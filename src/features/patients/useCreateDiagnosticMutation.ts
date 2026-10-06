import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createDiagnostic,
  type CreateDiagnosticInput,
} from '../../shared/api/diagnostics'
import { patientQueryKeys } from './patientQueryKeys'

export function useCreateDiagnosticMutation(patientId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDiagnosticInput) => {
      if (!patientId) {
        throw new Error('Select a patient before adding a diagnostic record')
      }
      return createDiagnostic(patientId, input)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientQueryKeys.all })
    },
  })
}
