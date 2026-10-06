import { createHash } from 'node:crypto'
import { loadImporterConfig } from '../config.js'
import { prisma } from '../prisma.js'
import { coalitionPatientsSchema, type CoalitionPatient } from '../schemas.js'

function sourceKey(...parts: string[]): string {
  return createHash('sha256').update(parts.join('\u0000')).digest('hex')
}

async function importPatient(input: CoalitionPatient): Promise<void> {
  const patientSourceKey = sourceKey(input.name, input.date_of_birth)

  await prisma.$transaction(async (transaction) => {
    const patient = await transaction.patient.upsert({
      where: { sourceKey: patientSourceKey },
      create: {
        sourceKey: patientSourceKey,
        name: input.name,
        gender: input.gender,
        age: input.age,
        profilePicture: input.profile_picture,
        dateOfBirth: input.date_of_birth,
        phoneNumber: input.phone_number,
        emergencyContact: input.emergency_contact,
        insuranceType: input.insurance_type,
      },
      update: {
        name: input.name,
        gender: input.gender,
        age: input.age,
        profilePicture: input.profile_picture,
        dateOfBirth: input.date_of_birth,
        phoneNumber: input.phone_number,
        emergencyContact: input.emergency_contact,
        insuranceType: input.insurance_type,
      },
      select: { id: true },
    })

    const historyKeys = input.diagnosis_history.map((entry) => ({ year: entry.year, month: entry.month }))
    await transaction.diagnosisHistory.deleteMany({
      where: {
        patientId: patient.id,
        ...(historyKeys.length === 0 ? {} : { NOT: { OR: historyKeys } }),
      },
    })
    if (historyKeys.length === 0) {
      await transaction.diagnosisHistory.deleteMany({ where: { patientId: patient.id } })
    }

    for (const [position, entry] of input.diagnosis_history.entries()) {
      await transaction.diagnosisHistory.upsert({
        where: { patientId_year_month: { patientId: patient.id, year: entry.year, month: entry.month } },
        create: {
          patientId: patient.id,
          position,
          month: entry.month,
          year: entry.year,
          systolicValue: entry.blood_pressure.systolic.value,
          systolicLevels: entry.blood_pressure.systolic.levels,
          diastolicValue: entry.blood_pressure.diastolic.value,
          diastolicLevels: entry.blood_pressure.diastolic.levels,
          heartRateValue: entry.heart_rate.value,
          heartRateLevels: entry.heart_rate.levels,
          respiratoryRateValue: entry.respiratory_rate.value,
          respiratoryRateLevels: entry.respiratory_rate.levels,
          temperatureValue: entry.temperature.value,
          temperatureLevels: entry.temperature.levels,
        },
        update: {
          position,
          systolicValue: entry.blood_pressure.systolic.value,
          systolicLevels: entry.blood_pressure.systolic.levels,
          diastolicValue: entry.blood_pressure.diastolic.value,
          diastolicLevels: entry.blood_pressure.diastolic.levels,
          heartRateValue: entry.heart_rate.value,
          heartRateLevels: entry.heart_rate.levels,
          respiratoryRateValue: entry.respiratory_rate.value,
          respiratoryRateLevels: entry.respiratory_rate.levels,
          temperatureValue: entry.temperature.value,
          temperatureLevels: entry.temperature.levels,
        },
      })
    }

    const diagnosticKeys = input.diagnostic_list.map((record) => sourceKey(record.name))
    await transaction.diagnosticRecord.deleteMany({
      where: {
        patientId: patient.id,
        sourceKey: { not: null, notIn: diagnosticKeys },
      },
    })
    for (const record of input.diagnostic_list) {
      const recordSourceKey = sourceKey(record.name)
      await transaction.diagnosticRecord.upsert({
        where: { patientId_sourceKey: { patientId: patient.id, sourceKey: recordSourceKey } },
        create: { patientId: patient.id, sourceKey: recordSourceKey, ...record },
        update: record,
      })
    }

    const labKeys = input.lab_results.map((name) => sourceKey(name))
    await transaction.labResult.deleteMany({
      where: { patientId: patient.id, sourceKey: { notIn: labKeys } },
    })
    for (const name of input.lab_results) {
      const labSourceKey = sourceKey(name)
      await transaction.labResult.upsert({
        where: { patientId_sourceKey: { patientId: patient.id, sourceKey: labSourceKey } },
        create: { patientId: patient.id, sourceKey: labSourceKey, name },
        update: { name },
      })
    }
  })
}

async function main(): Promise<void> {
  const config = loadImporterConfig()
  const authorization = Buffer.from(
    `${config.coalitionApiUsername}:${config.coalitionApiPassword}`,
  ).toString('base64')
  const response = await fetch(config.coalitionApiUrl, {
    headers: { Authorization: `Basic ${authorization}` },
    signal: AbortSignal.timeout(30_000),
  })

  if (!response.ok) {
    throw new Error(`Coalition API returned ${response.status} ${response.statusText}`)
  }

  const patients = coalitionPatientsSchema.parse(await response.json())
  for (const patient of patients) await importPatient(patient)
  console.info(`Imported ${patients.length} patients`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
