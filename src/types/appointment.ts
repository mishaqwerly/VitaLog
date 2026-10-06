export const examTypes = [
  'Blood Tests',
  'CT Scan',
  'MRI',
  'Ultrasound',
  'ECG',
  'General Checkup',
] as const

export type ExamType = (typeof examTypes)[number]

export type Appointment = {
  id: string
  patientName: string
  phone: string
  examType: ExamType
  scheduledAt: string
  note?: string
  createdAt: string
}

export type CreateAppointmentInput = {
  patientName: string
  phone: string
  examType: ExamType
  scheduledAt: string
  note?: string
}
