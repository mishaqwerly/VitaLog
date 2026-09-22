import styles from './PatientListItem.module.css'
import MoreHorizontalIcon from '../ui/icons/MoreHorizontalIcon'

import type { Patient } from '../../types/patient'
import { useEffect, useRef } from 'react'

export const PatientListItem = ({
  item,
  onSelect,
  isSelected = false,
  compact = false,
}: {
  item: Patient
  onSelect: (id: string) => void
  isSelected?: boolean
  compact?: boolean
}) => {
  const listItemRef = useRef<HTMLLIElement>(null)

  const handleClick = () => {
    onSelect(item.id)
  }

  useEffect(() => {
    if (!isSelected) return
    listItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [isSelected])

  return (
    <li
      ref={listItemRef}
      className={`${styles.item}${isSelected ? ` ${styles.selected}` : ''}${compact ? ` ${styles.compact}` : ''}`}
      onClick={handleClick}
    >
      <img className={styles.avatar} src={item.profilePicture} alt="" />
      <div className={styles.meta}>
        <strong>{item.name}</strong>
        {!compact && (
          <span>
            {item.gender}, {item.age}
          </span>
        )}
      </div>
      {!compact && <MoreHorizontalIcon />}
    </li>
  )
}
