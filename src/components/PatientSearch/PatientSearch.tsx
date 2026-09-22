import type { ChangeEvent } from 'react'
import { useEffect, useRef } from 'react'
import SearchIcon from '../ui/icons/SearchIcon'
import styles from './PatientSearch.module.css'

type PatientSearchProps = {
  value: string
  onChange: (value: string) => void
}

const PatientSearch = ({ value, onChange }: PatientSearchProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className={styles.search}>
      <SearchIcon className={styles.icon} />
      <input
        id="patients-search"
        type="search"
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder="Search patients"
        aria-label="Search patients"
        ref={inputRef}
      />
    </div>
  )
}

export default PatientSearch
