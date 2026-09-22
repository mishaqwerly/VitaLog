import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { applyTheme, getPreferredTheme, type Theme } from '../lib/theme'

type PreferencesValueContextType = {
  compactView: boolean
  theme: Theme
  isDarkTheme: boolean
}

type PreferencesActionsContextType = {
  toggleCompactView: () => void
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const PreferencesValueContext = createContext<PreferencesValueContextType | null>(null)
const PreferencesActionsContext = createContext<PreferencesActionsContextType | null>(null)

/**
 * UI preferences only — not server data, not form state.
 * Split value/actions so consumers that only toggle do not re-render on compactView changes
 * when using actions-only hooks (pattern for interview discussion).
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [compactView, setCompactView] = useState(false)
  const [theme, setThemeState] = useState<Theme>(() => getPreferredTheme())

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleCompactView = useCallback(() => {
    setCompactView((current) => !current)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      compactView,
      theme,
      isDarkTheme: theme === 'dark',
    }),
    [compactView, theme],
  )

  const actions = useMemo(
    () => ({
      toggleCompactView,
      toggleTheme,
      setTheme,
    }),
    [toggleCompactView, toggleTheme, setTheme],
  )

  return (
    <PreferencesActionsContext.Provider value={actions}>
      <PreferencesValueContext.Provider value={value}>
        {children}
      </PreferencesValueContext.Provider>
    </PreferencesActionsContext.Provider>
  )
}

export function usePreferencesValue() {
  const context = useContext(PreferencesValueContext)
  if (!context) {
    throw new Error('usePreferencesValue must be used within PreferencesProvider')
  }
  return context
}

export function usePreferencesActions() {
  const context = useContext(PreferencesActionsContext)
  if (!context) {
    throw new Error('usePreferencesActions must be used within PreferencesProvider')
  }
  return context
}
