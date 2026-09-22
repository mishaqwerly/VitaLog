import { useEffect, useRef } from 'react'
import { formatDateOfBirth } from '../../lib/formatDate'
import type { Patient } from '../../types/patient'
import styles from './PatientDetailsDialog.module.css'

type PatientDetailsDialogProps = {
  patient: Patient
  isOpen: boolean
  onClose: () => void
}

const PatientDetailsDialog = ({ patient, isOpen, onClose }: PatientDetailsDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const latestVitals = patient.diagnosisHistory[0]

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (!dialog.open) {
      dialog.showModal()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="patient-details-title"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <img src={patient.profilePicture} alt="" />
            <div>
              <span>Patient profile</span>
              <h2 id="patient-details-title">{patient.name}</h2>
              <p>
                {patient.gender}, {patient.age} years
              </p>
            </div>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className={styles.body}>
          <section className={styles.section} aria-labelledby="personal-information-heading">
            <h3 id="personal-information-heading">Personal information</h3>
            <dl className={styles.informationGrid}>
              <div>
                <dt>Date of birth</dt>
                <dd>{formatDateOfBirth(patient.dateOfBirth)}</dd>
              </div>
              <div>
                <dt>Phone number</dt>
                <dd>{patient.phoneNumber}</dd>
              </div>
              <div>
                <dt>Emergency contact</dt>
                <dd>{patient.emergencyContact}</dd>
              </div>
              <div>
                <dt>Insurance provider</dt>
                <dd>{patient.insuranceType}</dd>
              </div>
            </dl>
          </section>

          {latestVitals ? (
            <section className={styles.section} aria-labelledby="latest-vitals-heading">
              <h3 id="latest-vitals-heading">Latest vitals</h3>
              <div className={styles.vitalsGrid}>
                <article>
                  <span>Blood pressure</span>
                  <strong>
                    {latestVitals.bloodPressure.systolic.value}/
                    {latestVitals.bloodPressure.diastolic.value}
                  </strong>
                  <small>mmHg</small>
                </article>
                <article>
                  <span>Heart rate</span>
                  <strong>{latestVitals.heartRate.value}</strong>
                  <small>bpm</small>
                </article>
                <article>
                  <span>Temperature</span>
                  <strong>{latestVitals.temperature.value}</strong>
                  <small>°F</small>
                </article>
                <article>
                  <span>Respiratory rate</span>
                  <strong>{latestVitals.respiratoryRate.value}</strong>
                  <small>bpm</small>
                </article>
              </div>
            </section>
          ) : null}

          <div className={styles.recordsGrid}>
            <section className={styles.section} aria-labelledby="diagnoses-heading">
              <div className={styles.sectionHeading}>
                <h3 id="diagnoses-heading">Diagnostic records</h3>
                <span>{patient.diagnosticList.length}</span>
              </div>
              {patient.diagnosticList.length > 0 ? (
                <ul className={styles.recordList}>
                  {patient.diagnosticList.map((diagnosis) => (
                    <li key={`${diagnosis.name}-${diagnosis.status}`}>
                      <div>
                        <strong>{diagnosis.name}</strong>
                        <span>{diagnosis.description}</span>
                      </div>
                      <small>{diagnosis.status}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>No diagnostic records.</p>
              )}
            </section>

            <section className={styles.section} aria-labelledby="lab-results-dialog-heading">
              <div className={styles.sectionHeading}>
                <h3 id="lab-results-dialog-heading">Lab results</h3>
                <span>{patient.labResults.length}</span>
              </div>
              {patient.labResults.length > 0 ? (
                <ul className={styles.labList}>
                  {patient.labResults.map((result) => (
                    <li key={result}>{result}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>No lab results.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default PatientDetailsDialog
