export type DiagnosticStatus =
  | 'Under Observation'
  | 'Cured'
  | 'Inactive'
  | 'Untreated'

export type DiagnosticRecord = {
  id: string
  name: string
  description: string
  status: DiagnosticStatus
  note?: string
}

export type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }

export type DiagnosticFieldName = 'name' | 'description' | 'status' | 'note'

export type FieldErrors = Partial<Record<DiagnosticFieldName, string>>

export const DIAGNOSTIC_STATUS_OPTIONS: DiagnosticStatus[] = [
  'Under Observation',
  'Cured',
  'Inactive',
  'Untreated',
]

export const INITIAL_DIAGNOSTIC_RECORDS: DiagnosticRecord[] = [
  {
    id: 'hypertension',
    name: 'Hypertension',
    description: 'Chronic high blood pressure',
    status: 'Under Observation',
  },
  {
    id: 'type-2-diabetes',
    name: 'Type 2 Diabetes',
    description: 'Insulin resistance and elevated blood sugar',
    status: 'Cured',
  },
  {
    id: 'asthma',
    name: 'Asthma',
    description: 'Recurrent episodes of bronchial constriction',
    status: 'Inactive',
  },
  {
    id: 'osteoarthritis',
    name: 'Osteoarthritis',
    description: 'Degenerative joint disease',
    status: 'Untreated',
    note: 'Patient declined treatment in 2023',
  },
]
