export function formatDateOfBirth(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatAppointmentDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
