import type { CSSProperties } from 'react'
import styles from './Skeleton.module.css'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  circle?: boolean
  className?: string
}

const Skeleton = ({ width = '100%', height = '1rem', circle = false, className }: SkeletonProps) => {
  const style: CSSProperties = {
    width,
    height,
  }

  return (
    <span
      aria-hidden="true"
      className={`${styles.skeleton}${circle ? ` ${styles.circle}` : ''}${className ? ` ${className}` : ''}`}
      style={style}
    />
  )
}

export default Skeleton
