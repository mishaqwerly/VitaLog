import DownloadIcon from '../ui/icons/DownloadIcon'
import { useSelectedPatient } from '../../features/patients/useSelectedPatient'
import AsyncPanel from '../../shared/ui/AsyncPanel/AsyncPanel'
import Skeleton from '../../shared/ui/Skeleton/Skeleton'
import { downloadLabResult } from './downloadLabResult'
import styles from './LabResultsPanel.module.css'

type LabResultsPanelProps = {
  selectedPatientId: string | null
}

const LabResultsPanel = ({ selectedPatientId }: LabResultsPanelProps) => {
  const { patient, isPending, isError, error, refetch } = useSelectedPatient(selectedPatientId)
  const results = patient?.labResults ?? []
  const patientName = patient?.name ?? 'Patient'

  const listSkeleton = (
    <ul className={styles.list} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <li key={index} className={styles.item}>
          <Skeleton width="70%" height={16} />
          <Skeleton width={18} height={18} />
        </li>
      ))}
    </ul>
  )

  return (
    <section className={styles.labResultsPanel} aria-labelledby="lab-results-heading">
      <h2 className={styles.heading} id="lab-results-heading">
        Lab Results
      </h2>

      <AsyncPanel
        isPending={isPending}
        isError={isError}
        errorMessage={error?.message}
        isEmpty={!patient}
        onRetry={() => void refetch()}
        loadingLabel="Loading lab results..."
        emptyLabel="Select a patient to view lab results"
        skeleton={listSkeleton}
      >
        {results.length === 0 ? (
          <p className={styles.emptyMessage}>No lab results for this patient.</p>
        ) : (
          <ul className={styles.list}>
            {results.map((result) => (
              <li key={result} className={styles.item}>
                <span>{result}</span>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={`Download ${result}`}
                  title={`Download ${result}`}
                  onClick={() =>
                    downloadLabResult({
                      patientName,
                      resultName: result,
                    })
                  }
                >
                  <DownloadIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </AsyncPanel>
    </section>
  )
}

export default LabResultsPanel
