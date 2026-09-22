import { useEffect } from 'react'

const DEFAULT_TITLE = 'VitaLog Dashboard'

export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} | VitaLog` : DEFAULT_TITLE

    return () => {
      document.title = DEFAULT_TITLE
        }
  }, [title])
}