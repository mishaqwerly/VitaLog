import type { ReactNode } from 'react'
import { isNavigationPage, type NavigationPage } from '../../types/navigation'
import Logo from '../ui/icons/Logo'
import OfficeMap from './OfficeMap'
import styles from './Footer.module.css'

type FooterNavItem = {
  id: string
  label: string
  href: string
}

type FooterProps = {
  onNavigate?: (page: NavigationPage) => void
  navigation?: FooterNavItem[]
}

const defaultNavigation: FooterNavItem[] = [
  { id: 'overview', label: 'Overview', href: '/overview' },
  { id: 'patients', label: 'Patients', href: '/patients' },
  { id: 'schedule', label: 'Schedule', href: '/schedule' },
  { id: 'messages', label: 'Messages', href: '/messages' },
  { id: 'transactions', label: 'Transactions', href: '/transactions' },
]

const socialLinks: Array<{ label: string; shortLabel: string; href: string; icon: ReactNode }> = [
  {
    label: 'LinkedIn',
    shortLabel: 'in',
    href: 'https://www.linkedin.com/',
    icon: 'in',
  },
  {
    label: 'GitHub',
    shortLabel: 'gh',
    href: 'https://github.com/',
    icon: 'gh',
  },
  {
    label: 'Instagram',
    shortLabel: 'ig',
    href: 'https://www.instagram.com/',
    icon: 'ig',
  },
]

const Footer = ({
  onNavigate,
  navigation = defaultNavigation,
}: FooterProps) => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.information}>
        <div className={styles.brand}>
          <Logo className={styles.logo} />
          <p>Care data, made clear.</p>
        </div>

        <div className={styles.detailsGrid}>
          <section aria-labelledby="footer-office-heading">
            <h2 id="footer-office-heading">Wrocław office</h2>
            <address>
              ul. Rynek 12
              <br />
              50-101 Wrocław, Poland
            </address>
            <a className={styles.email} href="mailto:hello@vitalog.health">
              hello@vitalog.health
            </a>
          </section>

          <nav aria-labelledby="footer-navigation-heading">
            <h2 id="footer-navigation-heading">Explore</h2>
            <ul className={styles.navigationList}>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      if (
                        !onNavigate ||
                        !isNavigationPage(item.id) ||
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      ) {
                        return
                      }

                      event.preventDefault()
                      onNavigate(item.id)
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.socialSection}>
          <span>Follow VitaLog</span>
          <ul>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  <span className={styles.visuallyHidden}>{link.shortLabel}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} VitaLog. Demo healthcare dashboard.
        </p>
      </div>

      <OfficeMap />
    </div>
  </footer>
)

export default Footer
