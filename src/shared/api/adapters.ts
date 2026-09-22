import type { PatientDto } from './schemas'
import type { DiagnosisHistoryEntry, Patient, PatientDiagnosticItem } from '../../types/patient'

function toPatientId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function toDiagnosisHistoryEntry(dto: PatientDto['diagnosis_history'][number]): DiagnosisHistoryEntry {
  return {
    month: dto.month,
    year: dto.year,
    bloodPressure: {
      systolic: dto.blood_pressure.systolic,
      diastolic: dto.blood_pressure.diastolic,
    },
    heartRate: dto.heart_rate,
    respiratoryRate: dto.respiratory_rate,
    temperature: dto.temperature,
  }
}

function toDiagnosticItem(dto: PatientDto['diagnostic_list'][number]): PatientDiagnosticItem {
  return {
    name: dto.name,
    description: dto.description,
    status: dto.status,
  }
}

export function toPatient(dto: PatientDto): Patient {
  return {
    id: toPatientId(dto.name),
    name: dto.name,
    gender: dto.gender,
    age: dto.age,
    profilePicture: dto.profile_picture,
    dateOfBirth: dto.date_of_birth,
    phoneNumber: dto.phone_number,
    emergencyContact: dto.emergency_contact,
    insuranceType: dto.insurance_type,
    diagnosisHistory: dto.diagnosis_history.map(toDiagnosisHistoryEntry),
    diagnosticList: dto.diagnostic_list.map(toDiagnosticItem),
    labResults: dto.lab_results,
  }
}
