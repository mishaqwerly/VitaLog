export type PatientGender = 'Female' | 'Male'

export type VitalLevel = {
  value: number
  levels: string
}

export type DiagnosisHistoryEntry = {
  month: string
  year: number
  bloodPressure: {
    systolic: VitalLevel
    diastolic: VitalLevel
  }
  heartRate: VitalLevel
  respiratoryRate: VitalLevel
  temperature: VitalLevel
}

export type PatientDiagnosticItem = {
  id: string
  name: string
  description: string
  status: string
  note?: string
}

export type Patient = {
  id: string
  name: string
  gender: PatientGender
  age: number
  profilePicture: string
  dateOfBirth: string
  phoneNumber: string
  emergencyContact: string
  insuranceType: string
  diagnosisHistory: DiagnosisHistoryEntry[]
  diagnosticList: PatientDiagnosticItem[]
  labResults: string[]
}
