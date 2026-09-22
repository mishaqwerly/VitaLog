import type { ReactNode } from 'react'
import styles from './AsyncPanel.module.css'

type AsyncPanelProps = {
  isPending: boolean
  isError: boolean
  errorMessage?: string
  isEmpty?: boolean
  onRetry?: () => void
  loadingLabel?: string
  emptyLabel?: string
  skeleton: ReactNode
  children: ReactNode
}

const AsyncPanel = ({
  isPending,
  isError,
  errorMessage,
  isEmpty = false,
  onRetry,
  loadingLabel = 'Loading...',
  emptyLabel = 'No data available',
  skeleton,
  children,
}: AsyncPanelProps) => {
  if (isPending) {
    return (
      <div role="status" aria-live="polite">
        <span className={styles.panelMessage}>{loadingLabel}</span>
        {skeleton}
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.panelError} role="alert">
        <p>{errorMessage ?? 'Something went wrong while loading data.'}</p>
        {onRetry ? (
          <button type="button" className={styles.retryButton} onClick={onRetry}>
            Try again
          </button>
        ) : null}
      </div>
    )
  }

  if (isEmpty) {
    return <p className={styles.panelMessage}>{emptyLabel}</p>
  }

  return children
}

export default AsyncPanel
