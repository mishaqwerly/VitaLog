import type {
  DiagnosticStatus,
  FieldErrors,
  SubmitState,
} from '../../types/diagnostic'

export type FormState = {
  name: string
  description: string
  status: DiagnosticStatus
  note: string
  errors: FieldErrors
  submitState: SubmitState
}

export type { FieldErrors, SubmitState }
