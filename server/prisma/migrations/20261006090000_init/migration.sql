CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Patient" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "sourceKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "gender" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "profilePicture" TEXT NOT NULL,
  "dateOfBirth" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "emergencyContact" TEXT NOT NULL,
  "insuranceType" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DiagnosisHistory" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "patientId" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "month" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "systolicValue" DOUBLE PRECISION NOT NULL,
  "systolicLevels" TEXT NOT NULL,
  "diastolicValue" DOUBLE PRECISION NOT NULL,
  "diastolicLevels" TEXT NOT NULL,
  "heartRateValue" DOUBLE PRECISION NOT NULL,
  "heartRateLevels" TEXT NOT NULL,
  "respiratoryRateValue" DOUBLE PRECISION NOT NULL,
  "respiratoryRateLevels" TEXT NOT NULL,
  "temperatureValue" DOUBLE PRECISION NOT NULL,
  "temperatureLevels" TEXT NOT NULL,
  CONSTRAINT "DiagnosisHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DiagnosticRecord" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "patientId" UUID NOT NULL,
  "sourceKey" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DiagnosticRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LabResult" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "patientId" UUID NOT NULL,
  "sourceKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Patient_sourceKey_key" ON "Patient"("sourceKey");
CREATE INDEX "Patient_name_idx" ON "Patient"("name");
CREATE UNIQUE INDEX "DiagnosisHistory_patientId_year_month_key" ON "DiagnosisHistory"("patientId", "year", "month");
CREATE INDEX "DiagnosisHistory_patientId_idx" ON "DiagnosisHistory"("patientId");
CREATE UNIQUE INDEX "DiagnosticRecord_patientId_sourceKey_key" ON "DiagnosticRecord"("patientId", "sourceKey");
CREATE INDEX "DiagnosticRecord_patientId_idx" ON "DiagnosticRecord"("patientId");
CREATE UNIQUE INDEX "LabResult_patientId_sourceKey_key" ON "LabResult"("patientId", "sourceKey");
CREATE INDEX "LabResult_patientId_idx" ON "LabResult"("patientId");

ALTER TABLE "DiagnosisHistory"
  ADD CONSTRAINT "DiagnosisHistory_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DiagnosticRecord"
  ADD CONSTRAINT "DiagnosticRecord_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LabResult"
  ADD CONSTRAINT "LabResult_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
