import { useState, type FormEvent } from 'react'
import { useCreateAppointmentMutation } from '../../features/appointments/useCreateAppointmentMutation'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatAppointmentDateTime } from '../../lib/formatDate'
import { examTypes, type ExamType } from '../../types/appointment'
import Footer from '../Footer/Footer'
import Logo from '../ui/icons/Logo'
import clinicInterior from '../../assets/clinic/petr-HuWm7malJ18-unsplash.jpg'
import styles from './ClinicBookingPage.module.css'

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
]

const PROCEDURES: Array<{ type: ExamType; duration: string; description: string }> = [
  {
    type: 'Blood Tests',
    duration: '20 min',
    description: 'Routine bloodwork for lipids, inflammation, and organ function.',
  },
  {
    type: 'Ultrasound',
    duration: '30 min',
    description: 'Same-day imaging for abdomen, thyroid, and vascular checks.',
  },
  {
    type: 'ECG',
    duration: '15 min',
    description: 'Heart rhythm screening for palpitations, chest pain, and clearance.',
  },
  {
    type: 'CT Scan',
    duration: '40 min',
    description: 'High-resolution imaging for chest, abdomen, and trauma assessment.',
  },
  {
    type: 'MRI',
    duration: '45 min',
    description: 'Detailed scans of joints, spine, and soft tissue without radiation.',
  },
  {
    type: 'General Checkup',
    duration: '30 min',
    description: 'A physician visit covering history, vitals, and next diagnostic steps.',
  },
]

const clinicFooterLinks = [
  { id: 'procedures', label: 'Procedures', href: '#procedures' },
  { id: 'book', label: 'Book a visit', href: '#book' },
  { id: 'staff', label: 'Staff login', href: '/schedule' },
]

function getTomorrowDateInput(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toScheduledAt(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString()
}

function scrollToSection(id: string) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReduced ? 'auto' : 'smooth',
    block: 'start',
  })
}

export default function ClinicBookingPage() {
  const createAppointment = useCreateAppointmentMutation()
  const [patientName, setPatientName] = useState('')
  const [phone, setPhone] = useState('')
  const [examType, setExamType] = useState<ExamType>('General Checkup')
  const [date, setDate] = useState(getTomorrowDateInput)
  const [time, setTime] = useState('10:00')
  const [note, setNote] = useState('')
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null)

  useDocumentTitle('VitaLog Clinic Wrocław')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const appointment = await createAppointment.mutateAsync({
        patientName,
        phone,
        examType,
        scheduledAt: toScheduledAt(date, time),
        ...(note.trim() === '' ? {} : { note: note.trim() }),
      })
      setConfirmedAt(appointment.scheduledAt)
    } catch {
      // Error is rendered from the mutation state.
    }
  }

  const bookAnother = () => {
    createAppointment.reset()
    setConfirmedAt(null)
    setPatientName('')
    setPhone('')
    setNote('')
  }

  const selectProcedure = (type: ExamType) => {
    setExamType(type)
    scrollToSection('book')
  }

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#book">
        Skip to booking form
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.logoLink} href="/clinic" aria-label="VitaLog Clinic home">
            <Logo className={styles.logo} />
          </a>
          <nav className={styles.nav} aria-label="Clinic">
            <a href="#procedures">Procedures</a>
            <a href="#book">Book a visit</a>
            <a className={styles.staffNav} href="/schedule">
              Staff login
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="clinic-heading">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>VitaLog Clinic Wrocław</p>
            <h1 id="clinic-heading">Diagnostics in the city centre, booked in minutes.</h1>
            <p className={styles.lede}>
              VitaLog is a compact outpatient clinic on Rynek 12. We focus on clear
              imaging, lab work, and same-week physician review — without a long
              hospital wait.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="#book">
                Book an examination
              </a>
              <a className={styles.secondaryLink} href="#procedures">
                See procedures
              </a>
            </div>
          </div>

          <aside className={styles.facts} aria-label="Clinic details">
            <p>
              <span>Location</span>
              <strong>ul. Rynek 12, Wrocław</strong>
            </p>
            <p>
              <span>Hours</span>
              <strong>Mon–Fri, 09:00–16:30</strong>
            </p>
            <p>
              <span>Languages</span>
              <strong>English and Polish</strong>
            </p>
            <p>
              <span>Contact</span>
              <strong>
                <a href="mailto:hello@vitalog.health">hello@vitalog.health</a>
              </strong>
            </p>
          </aside>
        </section>

        <section className={styles.procedures} aria-labelledby="procedures-heading" id="procedures">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>What we offer</p>
            <h2 id="procedures-heading">Examinations you can book online</h2>
            <p>
              Choose a procedure to fill the booking form. A clinician reviews every
              request on the same day.
            </p>
          </div>

          <ul className={styles.procedureGrid}>
            {PROCEDURES.map((procedure) => (
              <li key={procedure.type}>
                <button
                  type="button"
                  className={`${styles.procedureCard}${examType === procedure.type ? ` ${styles.procedureCardActive}` : ''}`}
                  onClick={() => selectProcedure(procedure.type)}
                >
                  <span className={styles.procedureMeta}>
                    <strong>{procedure.type}</strong>
                    <span>{procedure.duration}</span>
                  </span>
                  <p>{procedure.description}</p>
                  <span className={styles.procedureCta}>Book this visit</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.booking} aria-labelledby="booking-heading" id="book">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Appointments</p>
            <h2 id="booking-heading">Book an examination</h2>
            <p>
              Pick a time that works. The visit appears on the doctor schedule as
              soon as you confirm.
            </p>
          </div>

          <div className={styles.bookingLayout}>
            <div className={styles.card}>
              {confirmedAt ? (
                <div className={styles.success} role="status">
                  <p>Your visit is booked for {formatAppointmentDateTime(confirmedAt)}.</p>
                  <button type="button" onClick={bookAnother}>
                    Book another visit
                  </button>
                </div>
              ) : (
                <form onSubmit={(event) => void handleSubmit(event)}>
                  <label>
                    Full name
                    <input
                      required
                      autoComplete="name"
                      maxLength={120}
                      value={patientName}
                      onChange={(event) => setPatientName(event.target.value)}
                    />
                  </label>

                  <label>
                    Phone
                    <input
                      required
                      type="tel"
                      autoComplete="tel"
                      placeholder="+48 123 456 789"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </label>

                  <label>
                    Examination
                    <select
                      value={examType}
                      onChange={(event) => setExamType(event.target.value as ExamType)}
                    >
                      {examTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className={styles.row}>
                    <label>
                      Date
                      <input
                        required
                        type="date"
                        min={new Date().toISOString().slice(0, 10)}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </label>
                    <label>
                      Time
                      <select value={time} onChange={(event) => setTime(event.target.value)}>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label>
                    Comment
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </label>

                  {createAppointment.isError ? (
                    <p className={styles.error} role="alert">
                      {createAppointment.error instanceof Error
                        ? createAppointment.error.message
                        : 'Could not book this visit'}
                    </p>
                  ) : null}

                  <button type="submit" disabled={createAppointment.isPending}>
                    {createAppointment.isPending ? 'Booking…' : 'Book examination'}
                  </button>
                </form>
              )}
            </div>

            <figure className={styles.photo}>
              <img
                src={clinicInterior}
                alt="Waiting room of the VitaLog clinic in Wrocław"
              />
              <figcaption>VitaLog clinic · Rynek 12</figcaption>
            </figure>
          </div>
        </section>
      </main>

      <Footer navigation={clinicFooterLinks} />
    </div>
  )
}
