import { useEffect, useRef, useState, type ReactNode } from 'react'
import doctorAvatar from '../../assets/doctor.png'
import doctorAvatar2x from '../../assets/doctor@2x.png'
import CalendarIcon from '../ui/icons/CalendarIcon'
import ChatIcon from '../ui/icons/ChatIcon'
import ChevronDownIcon from '../ui/icons/ChevronDownIcon'
import CreditCardIcon from '../ui/icons/CreditCardIcon'
import GroupIcon from '../ui/icons/GroupIcon'
import HomeIcon from '../ui/icons/HomeIcon'
import Logo from '../ui/icons/Logo'
import ConnectionStatus from '../../shared/ui/ConnectionStatus/ConnectionStatus'
import type { NavigationPage } from '../../types/navigation'
import styles from './Header.module.css'

import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { usePreferencesActions, usePreferencesValue } from '../../contexts/PreferencesContext'

type HeaderProps = {
  activePage: NavigationPage
  onNavigate: (page: NavigationPage) => void
}

const navigationItems = [
  { id: 'overview', label: 'Overview', href: '/overview', icon: <HomeIcon /> },
  { id: 'patients', label: 'Patients', href: '/patients', icon: <GroupIcon /> },
  { id: 'schedule', label: 'Schedule', href: '/schedule', icon: <CalendarIcon /> },
  { id: 'messages', label: 'Message', href: '/messages', icon: <ChatIcon /> },
  {
    id: 'transactions',
    label: 'Transactions',
    href: '/transactions',
    icon: <CreditCardIcon />,
  },
] satisfies Array<{
  id: NavigationPage
  label: string
  href: string
  icon: ReactNode
}>

const Header = ({ activePage, onNavigate }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const profileTriggerRef = useRef<HTMLButtonElement>(null)
  const isOnline = useOnlineStatus()
  const { isDarkTheme } = usePreferencesValue()
  const { toggleTheme } = usePreferencesActions()

  useEffect(() => {
    if (!isProfileOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
        profileTriggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileOpen])

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Logo className={styles.logo} />
        <ConnectionStatus isOnline={isOnline} />
      </div>

      <nav className={styles.navigation} aria-label="Main">
        <ul className={styles.navList}>
          {navigationItems.map((item) => (
            <li key={item.id}>
              <a
                className={styles.navLink}
                href={item.href}
                aria-current={activePage === item.id ? 'page' : undefined}
                onClick={(event) => {
                  if (
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
                {item.icon}
                <span className={styles.navLabel}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.doctor} ref={profileRef}>
        <button
          type="button"
          ref={profileTriggerRef}
          className={styles.profileTrigger}
          aria-expanded={isProfileOpen}
          aria-controls="doctor-profile-popover"
          aria-haspopup="dialog"
          onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
        >
          <img
            className={styles.doctorAvatar}
            src={doctorAvatar}
            srcSet={`${doctorAvatar} 1x, ${doctorAvatar2x} 2x`}
            alt=""
          />
          <span className={styles.doctorMeta}>
            <strong>Dr. Jose Simmons</strong>
            <span>General Practitioner</span>
          </span>
          <ChevronDownIcon
            className={`${styles.profileChevron}${isProfileOpen ? ` ${styles.profileChevronOpen}` : ''}`}
          />
        </button>

        {isProfileOpen ? (
          <div
            className={styles.profilePopover}
            id="doctor-profile-popover"
            role="dialog"
            aria-label="Doctor profile"
          >
            <div className={styles.profileHeader}>
              <img
                className={styles.profileAvatar}
                src={doctorAvatar}
                srcSet={`${doctorAvatar} 1x, ${doctorAvatar2x} 2x`}
                alt=""
              />
              <div className={styles.profileIdentity}>
                <strong>Dr. Jose Simmons</strong>
                <span>General Practitioner</span>
              </div>
            </div>

            <div className={styles.sessionStatus}>
              <span aria-hidden="true" />
              Active session
            </div>

            <div className={styles.preference}>
              <div>
                <span>Appearance</span>
                <strong>{isDarkTheme ? 'Dark theme' : 'Light theme'}</strong>
              </div>
              <button
                type="button"
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-pressed={isDarkTheme}
                aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {isDarkTheme ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Header
