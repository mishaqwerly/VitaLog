export function formatDateOfBirth(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
