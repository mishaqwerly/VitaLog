import { useState } from 'react'
import { formatDateOfBirth } from '../../lib/formatDate'
import { useSelectedPatient } from '../../features/patients/useSelectedPatient'
import BirthIcon from '../ui/icons/BirthIcon'
import FemaleIcon from '../ui/icons/FemaleIcon'
import InsuranceIcon from '../ui/icons/InsuranceIcon'
import MaleIcon from '../ui/icons/MaleIcon'
import PhoneIcon from '../ui/icons/PhoneIcon'
import AsyncPanel from '../../shared/ui/AsyncPanel/AsyncPanel'
import Skeleton from '../../shared/ui/Skeleton/Skeleton'
import PatientDetailsDialog from './PatientDetailsDialog'
import styles from './ProfilePanel.module.css'

type ProfilePanelProps = {
  selectedPatientId: string | null
}

const ProfilePanel = ({ selectedPatientId }: ProfilePanelProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { patient, isPending, isError, error, refetch } = useSelectedPatient(selectedPatientId)

  const profileSkeleton = (
    <div className={styles.skeletonWrap} aria-hidden="true">
      <Skeleton width={200} height={200} circle className={styles.photoSkeleton} />
      <Skeleton width="60%" height={24} />
      <div className={styles.skeletonDetails}>
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} width="100%" height={42} />
        ))}
      </div>
    </div>
  )

  return (
    <section className={styles.profilePanel} aria-labelledby="patient-name">
      <AsyncPanel
        isPending={isPending}
        isError={isError}
        errorMessage={error?.message}
        isEmpty={!patient}
        onRetry={() => void refetch()}
        loadingLabel="Loading profile..."
        emptyLabel="No patient selected"
        skeleton={profileSkeleton}
      >
        {patient ? (
          <>
            <img className={styles.photo} src={patient.profilePicture} alt="" />
            <h2 id="patient-name" className={styles.name}>
              {patient.name}
            </h2>

            <dl className={styles.details}>
              <div className={styles.detail}>
                <BirthIcon className={styles.detailIcon} />
                <div>
                  <dt>Date Of Birth</dt>
                  <dd>{formatDateOfBirth(patient.dateOfBirth)}</dd>
                </div>
              </div>

              <div className={styles.detail}>
                {patient.gender === 'Female' ? (
                  <FemaleIcon className={styles.detailIcon} />
                ) : (
                  <MaleIcon className={styles.detailIcon} />
                )}
                <div>
                  <dt>Gender</dt>
                  <dd>{patient.gender}</dd>
                </div>
              </div>

              <div className={styles.detail}>
                <PhoneIcon className={styles.detailIcon} />
                <div>
                  <dt>Contact Info.</dt>
                  <dd>{patient.phoneNumber}</dd>
                </div>
              </div>

              <div className={styles.detail}>
                <PhoneIcon className={styles.detailIcon} />
                <div>
                  <dt>Emergency Contacts</dt>
                  <dd>{patient.emergencyContact}</dd>
                </div>
              </div>

              <div className={styles.detail}>
                <InsuranceIcon className={styles.detailIcon} />
                <div>
                  <dt>Insurance Provider</dt>
                  <dd>{patient.insuranceType}</dd>
                </div>
              </div>
            </dl>

            <button
              type="button"
              className={styles.cta}
              onClick={() => setIsDetailsOpen(true)}
              aria-haspopup="dialog"
            >
              Show All Information
            </button>

            <PatientDetailsDialog
              patient={patient}
              isOpen={isDetailsOpen}
              onClose={() => setIsDetailsOpen(false)}
            />
          </>
        ) : null}
      </AsyncPanel>
    </section>
  )
}

export default ProfilePanel
