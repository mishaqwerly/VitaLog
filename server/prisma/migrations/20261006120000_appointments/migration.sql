CREATE TABLE "Appointment" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "patientName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "examType" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");
