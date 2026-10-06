import AsyncPanel from '../../shared/ui/AsyncPanel/AsyncPanel'
import Skeleton from '../../shared/ui/Skeleton/Skeleton'
import { useAppointmentsQuery } from '../../features/appointments/useAppointmentsQuery'
import { formatAppointmentDateTime } from '../../lib/formatDate'
import styles from './SchedulePage.module.css'

const SchedulePage = () => {
  const appointmentsQuery = useAppointmentsQuery()
  const appointments = appointmentsQuery.data ?? []

  return (
    <main className={styles.page} aria-labelledby="schedule-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Clinic bookings</p>
          <h1 id="schedule-title">Schedule</h1>
        </div>
        <p className={styles.share}>
          Patients book at <a href="/clinic">/clinic</a>
        </p>
      </header>

      <AsyncPanel
        isPending={appointmentsQuery.isPending}
        isError={appointmentsQuery.isError}
        errorMessage={
          appointmentsQuery.error instanceof Error
            ? appointmentsQuery.error.message
            : 'Could not load appointments'
        }
        isEmpty={appointments.length === 0}
        emptyLabel="No examinations booked yet."
        onRetry={() => void appointmentsQuery.refetch()}
        loadingLabel="Loading schedule..."
        skeleton={<Skeleton height={72} />}
      >
        <ul className={styles.list}>
          {appointments.map((appointment) => (
            <li key={appointment.id} className={styles.item}>
              <div>
                <strong>{appointment.patientName}</strong>
                <span>{appointment.examType}</span>
              </div>
              <div className={styles.meta}>
                <time dateTime={appointment.scheduledAt}>
                  {formatAppointmentDateTime(appointment.scheduledAt)}
                </time>
                <a href={`tel:${appointment.phone.replaceAll(' ', '')}`}>{appointment.phone}</a>
                {appointment.note ? <p>{appointment.note}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </AsyncPanel>
    </main>
  )
}

export default SchedulePage
