import { apiRequest } from './http'
import { diagnosticRecordSchema } from './schemas'
import type { DiagnosticRecord } from '../../types/diagnostic'

export type CreateDiagnosticInput = Omit<DiagnosticRecord, 'id'>

export async function createDiagnostic(
  patientId: string,
  input: CreateDiagnosticInput,
): Promise<DiagnosticRecord> {
  const raw = await apiRequest<unknown>(
    `/api/patients/${patientId}/diagnostics`,
    { method: 'POST', body: input },
  )
  return diagnosticRecordSchema.parse(raw) as DiagnosticRecord
}
