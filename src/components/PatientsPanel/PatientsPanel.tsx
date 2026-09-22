import { useState } from 'react'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { usePreferencesActions, usePreferencesValue } from '../../contexts/PreferencesContext'
import { usePatientsQuery } from '../../features/patients/usePatientsQuery'
import { filterPatientsByName } from '../../lib/filterPatients'
import PatientSearch from '../PatientSearch/PatientSearch'
import { PatientListItem } from '../PatientListItem/PatientListItem'
import AsyncPanel from '../../shared/ui/AsyncPanel/AsyncPanel'
import Skeleton from '../../shared/ui/Skeleton/Skeleton'
import styles from './PatientsPanel.module.css'

type PatientsPanelProps = {
  selectedPatientId: string | null
  onSelectPatient: (id: string) => void
}

const PatientsPanel = ({ selectedPatientId, onSelectPatient }: PatientsPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500)
  const { data: patients = [], isPending, isError, error, refetch } = usePatientsQuery()
  const visiblePatients = filterPatientsByName(patients, debouncedSearchQuery)
  const { compactView } = usePreferencesValue()
  const { toggleCompactView } = usePreferencesActions()

  const listSkeleton = (
    <ul className={styles.list} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index} className={styles.skeletonItem}>
          <Skeleton width={48} height={48} circle />
          <div className={styles.skeletonMeta}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="45%" height={14} />
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <section
      className={`${styles.patientsPanel}${compactView ? ` ${styles.compact}` : ''}`}
      aria-labelledby="patients-heading"
    >
      <div className={styles.panelHeader}>
        <h2 id="patients-heading">Patients</h2>
        <button
          type="button"
          className={styles.compactToggle}
          aria-pressed={compactView}
          onClick={toggleCompactView}
        >
          {compactView ? 'Comfortable view' : 'Compact view'}
        </button>
      </div>

      <AsyncPanel
        isPending={isPending}
        isError={isError}
        errorMessage={error?.message}
        isEmpty={!isPending && !isError && patients.length === 0}
        onRetry={() => void refetch()}
        loadingLabel="Loading patients..."
        emptyLabel="No patients available"
        skeleton={listSkeleton}
      >
        <>
          <PatientSearch value={searchQuery} onChange={setSearchQuery} />

          {visiblePatients.length === 0 ? (
            <p className={styles.statusMessage}>No patients found</p>
          ) : (
            <ul className={styles.list}>
              {visiblePatients.map((item) => (
                <PatientListItem
                  key={item.id}
                  item={item}
                  onSelect={onSelectPatient}
                  isSelected={item.id === selectedPatientId}
                  compact={compactView}
                />
              ))}
            </ul>
          )}
        </>
      </AsyncPanel>
    </section>
  )
}

export default PatientsPanel
