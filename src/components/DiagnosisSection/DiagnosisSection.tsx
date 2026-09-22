import ArrowDownIcon from '../ui/icons/ArrowDownIcon'
import ArrowUpIcon from '../ui/icons/ArrowUpIcon'
import ChevronDownIcon from '../ui/icons/ChevronDownIcon'
import HeartRateIcon from '../ui/icons/HeartRateIcon'
import RespiratoryRateIcon from '../ui/icons/RespiratoryRateIcon'
import TemperatureIcon from '../ui/icons/TemperatureIcon'
import { useSelectedPatient } from '../../features/patients/useSelectedPatient'
import AsyncPanel from '../../shared/ui/AsyncPanel/AsyncPanel'
import Skeleton from '../../shared/ui/Skeleton/Skeleton'
import BloodPressureChart from './BloodPressureChart'
import styles from './DiagnosisSection.module.css'

type DiagnosisSectionProps = {
  selectedPatientId: string | null
}

function levelShowsUp(levels: string) {
  return levels.toLowerCase().includes('higher')
}

function levelShowsDown(levels: string) {
  return levels.toLowerCase().includes('lower')
}

const DiagnosisSection = ({ selectedPatientId }: DiagnosisSectionProps) => {
  const { patient, isPending, isError, error, refetch } = useSelectedPatient(selectedPatientId)
  const latestEntry = patient?.diagnosisHistory[0]

  const diagnosisSkeleton = (
    <div className={styles.skeletonWrap} aria-hidden="true">
      <Skeleton width="100%" height={280} />
      <div className={styles.vitals}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} width="100%" height={140} />
        ))}
      </div>
    </div>
  )

  return (
    <section className={styles.diagnosisSection} aria-labelledby="diagnosis-heading">
      <h2 className={styles.heading} id="diagnosis-heading">
        Diagnosis History
      </h2>

      <AsyncPanel
        isPending={isPending}
        isError={isError}
        errorMessage={error?.message}
        isEmpty={!latestEntry}
        onRetry={() => void refetch()}
        loadingLabel="Loading diagnosis history..."
        emptyLabel="No diagnosis history for this patient"
        skeleton={diagnosisSkeleton}
      >
        {latestEntry ? (
          <>
            <article className={styles.bloodPressure}>
              <div className={styles.bloodPressureHeader}>
                <h3>Blood Pressure</h3>
                <button
                  type="button"
                  className={styles.rangeButton}
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  Last 6 months
                  <ChevronDownIcon />
                </button>
              </div>

              <div className={styles.bloodPressureBody}>
                <div className={styles.chart}>
                  <BloodPressureChart entries={patient.diagnosisHistory} />
                </div>

                <dl className={styles.stats}>
                  <div className={`${styles.stat} ${styles.statSystolic}`}>
                    <dt>Systolic</dt>
                    <dd className={styles.statValue}>{latestEntry.bloodPressure.systolic.value}</dd>
                    <dd className={styles.statLevel}>
                      {levelShowsUp(latestEntry.bloodPressure.systolic.levels) ? (
                        <ArrowUpIcon />
                      ) : null}
                      {levelShowsDown(latestEntry.bloodPressure.systolic.levels) ? (
                        <ArrowDownIcon />
                      ) : null}
                      {latestEntry.bloodPressure.systolic.levels}
                    </dd>
                  </div>

                  <div className={`${styles.stat} ${styles.statDiastolic}`}>
                    <dt>Diastolic</dt>
                    <dd className={styles.statValue}>{latestEntry.bloodPressure.diastolic.value}</dd>
                    <dd className={styles.statLevel}>
                      {levelShowsUp(latestEntry.bloodPressure.diastolic.levels) ? (
                        <ArrowUpIcon />
                      ) : null}
                      {levelShowsDown(latestEntry.bloodPressure.diastolic.levels) ? (
                        <ArrowDownIcon />
                      ) : null}
                      {latestEntry.bloodPressure.diastolic.levels}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>

            <div className={styles.vitals}>
              <article className={`${styles.vitalCard} ${styles.vitalRespiratory}`}>
                <RespiratoryRateIcon className={styles.vitalIcon} />
                <h3 className={styles.vitalTitle}>Respiratory Rate</h3>
                <p className={styles.vitalValue}>{latestEntry.respiratoryRate.value} bpm</p>
                <p className={styles.vitalLevel}>{latestEntry.respiratoryRate.levels}</p>
              </article>

              <article className={`${styles.vitalCard} ${styles.vitalTemperature}`}>
                <TemperatureIcon className={styles.vitalIcon} />
                <h3 className={styles.vitalTitle}>Temperature</h3>
                <p className={styles.vitalValue}>{latestEntry.temperature.value}°F</p>
                <p className={styles.vitalLevel}>{latestEntry.temperature.levels}</p>
              </article>

              <article className={`${styles.vitalCard} ${styles.vitalHeart}`}>
                <HeartRateIcon className={styles.vitalIcon} />
                <h3 className={styles.vitalTitle}>Heart Rate</h3>
                <p className={styles.vitalValue}>{latestEntry.heartRate.value} bpm</p>
                <p
                  className={`${styles.vitalLevel}${levelShowsDown(latestEntry.heartRate.levels) ? ` ${styles.vitalLevelDown}` : ''}`}
                >
                  {levelShowsDown(latestEntry.heartRate.levels) ? <ArrowDownIcon /> : null}
                  {latestEntry.heartRate.levels}
                </p>
              </article>
            </div>
          </>
        ) : null}
      </AsyncPanel>
    </section>
  )
}

export default DiagnosisSection
