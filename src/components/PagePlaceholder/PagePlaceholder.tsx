import type { NavigationPage } from '../../types/navigation'
import BrandMark from '../ui/icons/BrandMark'
import styles from './PagePlaceholder.module.css'

type PlaceholderPage = Exclude<NavigationPage, 'patients'>

type PagePlaceholderProps = {
  page: PlaceholderPage
  onOpenPatients: () => void
}

const pageContent: Record<PlaceholderPage, { title: string; description: string }> = {
  overview: {
    title: 'Overview',
    description: 'A concise summary of your practice activity and patient insights will appear here.',
  },
  schedule: {
    title: 'Schedule',
    description: 'Appointments, availability, and daily planning tools are being prepared.',
  },
  messages: {
    title: 'Messages',
    description: 'Secure conversations with patients and care teams are coming soon.',
  },
  transactions: {
    title: 'Transactions',
    description: 'Billing activity, payments, and transaction history will be available here.',
  },
}

const PagePlaceholder = ({ page, onOpenPatients }: PagePlaceholderProps) => {
  const content = pageContent[page]

  return (
    <main className={styles.page} aria-labelledby="placeholder-title">
      <BrandMark className={styles.illustration} aria-hidden="true" />
      <span className={styles.eyebrow}>Coming soon</span>
      <h1 id="placeholder-title">{content.title}</h1>
      <p>{content.description}</p>
      <button type="button" onClick={onOpenPatients}>
        Open patient dashboard
      </button>
    </main>
  )
}

export default PagePlaceholder
