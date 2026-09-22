import styles from './ConnectionStatus.module.css'

type ConnectionStatusProps = {
  isOnline: boolean
}

const ConnectionStatus = ({ isOnline }: ConnectionStatusProps) => {
  const statusLabel = isOnline ? 'Connected' : 'Offline'

  return (
    <div
      className={`${styles.status} ${isOnline ? styles.online : styles.offline}`}
      role="status"
      aria-live="polite"
      aria-label={`Connection status: ${statusLabel}`}
    >
      <span className={styles.indicator} aria-hidden="true">
        <span className={styles.dot} />
      </span>
      <span className={styles.label}>Connection</span>
      <strong className={styles.value}>{statusLabel}</strong>
    </div>
  )
}

export default ConnectionStatus
