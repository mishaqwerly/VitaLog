import { useEffect, useState } from 'react'
import styles from './App.module.css'
import AuthScreen from './components/AuthScreen/AuthScreen'
import Header from './components/Header/Header'
import DiagnosisSection from './components/DiagnosisSection/DiagnosisSection'
import DiagnosticListSection from './components/DiagnosticListSection/DiagnosticListSection'
import Footer from './components/Footer/Footer'
import LabResultsPanel from './components/LabResultsPanel/LabResultsPanel'
import PagePlaceholder from './components/PagePlaceholder/PagePlaceholder'
import PatientsPanel from './components/PatientsPanel/PatientsPanel'
import ProfilePanel from './components/ProfilePanel/ProfilePanel'
import { useSelectedPatient } from './features/patients/useSelectedPatient'
import { useAuth } from './contexts/AuthContext'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import {
  isNavigationPage,
  type NavigationPage,
} from './types/navigation'

const pageTitles: Record<NavigationPage, string> = {
  overview: 'Overview',
  patients: 'Patients',
  schedule: 'Schedule',
  messages: 'Messages',
  transactions: 'Transactions',
}

function getPageFromPath(): NavigationPage {
  const page = window.location.pathname.split('/').filter(Boolean)[0] ?? 'patients'
  return isNavigationPage(page) ? page : 'patients'
}

function DashboardApp() {
  const { user, logout } = useAuth()
  const [activePage, setActivePage] = useState<NavigationPage>(getPageFromPath)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const { patient, effectiveSelectedId } = useSelectedPatient(selectedPatientId)

  useDocumentTitle(activePage === 'patients' ? patient?.name : pageTitles[activePage])

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getPageFromPath())
      window.scrollTo({ top: 0 })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigate = (page: NavigationPage) => {
    const nextPath = `/${page}`

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }

    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        userName={user?.name ?? 'VitaLog user'}
        onLogout={logout}
      />

      {activePage === 'patients' ? (
        <main className={styles.dashboard}>
          <PatientsPanel
            selectedPatientId={effectiveSelectedId}
            onSelectPatient={setSelectedPatientId}
          />

          <div className={styles.center}>
            <DiagnosisSection selectedPatientId={effectiveSelectedId} />
            <DiagnosticListSection selectedPatientId={effectiveSelectedId} />
          </div>

          <div className={styles.side}>
            <ProfilePanel selectedPatientId={effectiveSelectedId} />
            <LabResultsPanel selectedPatientId={effectiveSelectedId} />
          </div>
        </main>
      ) : (
        <PagePlaceholder page={activePage} onOpenPatients={() => handleNavigate('patients')} />
      )}

      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

function App() {
  const { user, isPending } = useAuth()

  if (isPending) {
    return (
      <main className={styles.authLoading}>
        <p>Restoring secure session…</p>
      </main>
    )
  }

  return user ? <DashboardApp /> : <AuthScreen />
}

export default App
