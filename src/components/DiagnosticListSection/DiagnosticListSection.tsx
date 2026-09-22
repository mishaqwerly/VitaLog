import { useMemo, useState } from 'react'
import DiagnosticForm from '../DiagnosticForm/DiagnosticForm'
import {
  type DiagnosticRecord,
  type DiagnosticStatus,
} from '../../types/diagnostic'
import { useSelectedPatient } from '../../features/patients/useSelectedPatient'
import AsyncPanel from '../../shared/ui/AsyncPanel/AsyncPanel'
import Skeleton from '../../shared/ui/Skeleton/Skeleton'
import ChevronDownIcon from '../ui/icons/ChevronDownIcon'
import styles from './DiagnosticListSection.module.css'

type DiagnosticListSectionProps = {
  selectedPatientId: string | null
}

function isDiagnosticStatus(status: string): status is DiagnosticStatus {
  return (
    status === 'Under Observation' ||
    status === 'Cured' ||
    status === 'Inactive' ||
    status === 'Untreated'
  )
}

function mapApiDiagnostic(
  item: { name: string; description: string; status: string },
  index: number,
): DiagnosticRecord {
  return {
    id: `api-${item.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    name: item.name,
    description: item.description,
    status: isDiagnosticStatus(item.status) ? item.status : 'Under Observation',
  }
}

const DiagnosticListSection = ({ selectedPatientId }: DiagnosticListSectionProps) => {
  const { patient, isPending, isError, error, refetch } = useSelectedPatient(selectedPatientId)
  const [localRecords, setLocalRecords] = useState<DiagnosticRecord[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  const apiRecords = useMemo(
    () => patient?.diagnosticList.map(mapApiDiagnostic) ?? [],
    [patient],
  )

  const records = useMemo(() => [...apiRecords, ...localRecords], [apiRecords, localRecords])

  const handleAddRecord = async (record: DiagnosticRecord) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 500)
    })

    setLocalRecords((current) => [...current, record])
  }

  const tableSkeleton = (
    <div className={styles.tableWrap} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} width="100%" height={52} />
      ))}
    </div>
  )

  return (
    <section className={styles.diagnosticListSection} aria-labelledby="diagnostic-list-heading">
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading} id="diagnostic-list-heading">
          Diagnostic List
        </h2>
        <button
          type="button"
          className={styles.formToggle}
          aria-expanded={isFormOpen}
          aria-controls="diagnostic-form-panel"
          disabled={isPending || !patient}
          onClick={() => setIsFormOpen((isOpen) => !isOpen)}
        >
          {isFormOpen ? 'Hide form' : 'Add record'}
          <ChevronDownIcon
            className={`${styles.toggleChevron}${isFormOpen ? ` ${styles.toggleChevronOpen}` : ''}`}
          />
        </button>
      </div>

      <AsyncPanel
        isPending={isPending}
        isError={isError}
        errorMessage={error?.message}
        isEmpty={!patient}
        onRetry={() => void refetch()}
        loadingLabel="Loading diagnostic list..."
        emptyLabel="Select a patient to view diagnostics"
        skeleton={tableSkeleton}
      >
        <>
          <div
            id="diagnostic-form-panel"
            className={`${styles.formPanel}${isFormOpen ? '' : ` ${styles.formPanelClosed}`}`}
            aria-hidden={!isFormOpen}
          >
            <div className={styles.formPanelInner}>
              <DiagnosticForm onAdd={handleAddRecord} />
            </div>
          </div>

          {records.length === 0 ? (
            <p className={styles.emptyMessage}>No diagnostic records for this patient yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Problem/Diagnosis</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <th scope="row">{record.name}</th>
                      <td>
                        {record.description}
                        {record.note ? (
                          <span className={styles.note}>
                            <strong>Note:</strong> {record.note}
                          </span>
                        ) : null}
                      </td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      </AsyncPanel>
    </section>
  )
}

export default DiagnosticListSection
