import type { DiagnosticFieldName, DiagnosticRecord, DiagnosticStatus, FieldErrors } from '../../types/diagnostic'
import type { FormState } from './diagnosticFormTypes'

export type FormAction =
  | { type: 'SET_FIELD'; field: 'name' | 'description' | 'note'; value: string }
  | { type: 'SET_STATUS'; value: DiagnosticStatus }
  | { type: 'SET_ERRORS'; errors: FieldErrors }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; message: string }
  | { type: 'RESET' }

export function createInitialFormState(): FormState {
  return {
    name: '',
    description: '',
    status: 'Under Observation',
    note: '',
    errors: {},
    submitState: { status: 'idle' },
  }
}

export function validateFormState(state: FormState): FieldErrors {
  const errors: FieldErrors = {}
  const name = state.name.trim()
  const description = state.description.trim()
  const note = state.note.trim()

  if (!name) {
    errors.name = 'Problem / diagnosis name is required'
  }

  if (!description) {
    errors.description = 'Description is required'
  } else if (description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }

  if (state.status === 'Untreated' && !note) {
    errors.note = 'Note is required when status is Untreated'
  }

  return errors
}

export function getFirstInvalidField(errors: FieldErrors): DiagnosticFieldName | null {
  const order: DiagnosticFieldName[] = ['name', 'description', 'status', 'note']
  return order.find((field) => errors[field]) ?? null
}

export function buildDiagnosticRecord(
  state: FormState,
): Omit<DiagnosticRecord, 'id'> {
  const record: Omit<DiagnosticRecord, 'id'> = {
    name: state.name.trim(),
    description: state.description.trim(),
    status: state.status,
  }

  const note = state.note.trim()
  if (state.status === 'Untreated' && note) {
    record.note = note
  }

  return record
}

function clearFieldError(
  errors: FieldErrors,
  field: DiagnosticFieldName,
): FieldErrors {
  if (!errors[field]) {
    return errors
  }

  const nextErrors = { ...errors }
  delete nextErrors[field]
  return nextErrors
}

export function diagnosticFormReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD': {
      const nextErrors = clearFieldError(state.errors, action.field)
      return {
        ...state,
        [action.field]: action.value,
        errors: nextErrors,
        submitState:
          state.submitState.status === 'error'
            ? { status: 'idle' }
            : state.submitState,
      }
    }

    case 'SET_STATUS': {
      const note = action.value === 'Untreated' ? state.note : ''
      const nextErrors = {
        ...clearFieldError(state.errors, 'status'),
        ...(action.value === 'Untreated' ? {} : clearFieldError(state.errors, 'note')),
      }

      return {
        ...state,
        status: action.value,
        note,
        errors: nextErrors,
        submitState:
          state.submitState.status === 'error'
            ? { status: 'idle' }
            : state.submitState,
      }
    }

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        submitState: { status: 'idle' },
      }

    case 'SUBMIT_START':
      return {
        ...state,
        errors: {},
        submitState: { status: 'submitting' },
      }

    case 'SUBMIT_SUCCESS':
      return createInitialFormState()

    case 'SUBMIT_ERROR':
      return {
        ...state,
        submitState: { status: 'error', message: action.message },
      }

    case 'RESET':
      return createInitialFormState()

    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}

