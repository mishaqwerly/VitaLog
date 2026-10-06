import {
  useReducer,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import {
  DIAGNOSTIC_STATUS_OPTIONS,
  type DiagnosticRecord,
} from '../../types/diagnostic'
import styles from './DiagnosticForm.module.css'
import {
  buildDiagnosticRecord,
  createInitialFormState,
  diagnosticFormReducer,
  getFirstInvalidField,
  validateFormState,
} from './diagnosticFormReducer'

type DiagnosticFormProps = {
  onAdd: (record: Omit<DiagnosticRecord, 'id'>) => Promise<void>
}

const FIELD_IDS = {
  name: 'diag-name',
  description: 'diag-description',
  status: 'diag-status',
  note: 'diag-note',
} as const

const DiagnosticForm = ({ onAdd }: DiagnosticFormProps) => {
  const [state, dispatch] = useReducer(
    diagnosticFormReducer,
    undefined,
    createInitialFormState,
  )

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  const fieldRefs = {
    name: nameRef,
    description: descriptionRef,
    status: statusRef,
    note: noteRef,
  }

  const isSubmitting = state.submitState.status === 'submitting'
  const showNoteField = state.status === 'Untreated'

  const focusField = (field: keyof typeof fieldRefs) => {
    fieldRefs[field].current?.focus()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validateFormState(state)
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors })
      const firstInvalidField = getFirstInvalidField(errors)
      if (firstInvalidField) {
        focusField(firstInvalidField)
      }
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      await onAdd(buildDiagnosticRecord(state))
      dispatch({ type: 'SUBMIT_SUCCESS' })
    } catch (error) {
      dispatch({
        type: 'SUBMIT_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to save diagnostic record',
      })
    }
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FIELD', field: 'name', value: event.target.value })
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'SET_FIELD',
      field: 'description',
      value: event.target.value,
    })
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'SET_STATUS',
      value: event.target.value as typeof state.status,
    })
  }

  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_FIELD', field: 'note', value: event.target.value })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formTitle} id="add-diagnostic-heading">
        Add diagnostic record
      </h3>

      {state.submitState.status === 'error' && (
        <p className={styles.formError} role="alert">
          {state.submitState.message}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor={FIELD_IDS.name}>Problem / Diagnosis</label>
        <input
          id={FIELD_IDS.name}
          ref={nameRef}
          type="text"
          value={state.name}
          onChange={handleNameChange}
          aria-invalid={Boolean(state.errors.name)}
          aria-describedby={state.errors.name ? `${FIELD_IDS.name}-error` : undefined}
          disabled={isSubmitting}
        />
        {state.errors.name && (
          <span id={`${FIELD_IDS.name}-error`} className={styles.fieldError} role="alert">
            {state.errors.name}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={FIELD_IDS.description}>Description</label>
        <textarea
          id={FIELD_IDS.description}
          ref={descriptionRef}
          value={state.description}
          onChange={handleDescriptionChange}
          rows={3}
          aria-invalid={Boolean(state.errors.description)}
          aria-describedby={
            state.errors.description ? `${FIELD_IDS.description}-error` : undefined
          }
          disabled={isSubmitting}
        />
        {state.errors.description && (
          <span
            id={`${FIELD_IDS.description}-error`}
            className={styles.fieldError}
            role="alert"
          >
            {state.errors.description}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={FIELD_IDS.status}>Status</label>
        <select
          id={FIELD_IDS.status}
          ref={statusRef}
          value={state.status}
          onChange={handleStatusChange}
          aria-invalid={Boolean(state.errors.status)}
          aria-describedby={state.errors.status ? `${FIELD_IDS.status}-error` : undefined}
          disabled={isSubmitting}
        >
          {DIAGNOSTIC_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {state.errors.status && (
          <span id={`${FIELD_IDS.status}-error`} className={styles.fieldError} role="alert">
            {state.errors.status}
          </span>
        )}
      </div>

      {showNoteField && (
        <div className={styles.field}>
          <label htmlFor={FIELD_IDS.note}>Note</label>
          <textarea
            id={FIELD_IDS.note}
            ref={noteRef}
            value={state.note}
            onChange={handleNoteChange}
            rows={2}
            aria-invalid={Boolean(state.errors.note)}
            aria-describedby={state.errors.note ? `${FIELD_IDS.note}-error` : undefined}
            disabled={isSubmitting}
          />
          {state.errors.note && (
            <span id={`${FIELD_IDS.note}-error`} className={styles.fieldError} role="alert">
              {state.errors.note}
            </span>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add record'}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Reset
        </button>
      </div>
    </form>
  )
}

export default DiagnosticForm
