type LabResultReport = {
  patientName: string
  resultName: string
}

function toFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function downloadLabResult({ patientName, resultName }: LabResultReport) {
  const generatedAt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date())

  const report = [
    'VITALOG',
    'Laboratory Result Report',
    '========================',
    '',
    `Patient: ${patientName}`,
    `Test: ${resultName}`,
    `Generated: ${generatedAt}`,
    '',
    'Result',
    '------',
    'This is a placeholder laboratory document for demonstration purposes.',
    'No clinical values are available in the current data source.',
    '',
    'This document is not intended for medical use.',
  ].join('\n')

  const blob = new Blob([`\uFEFF${report}`], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${toFileName(patientName)}-${toFileName(resultName)}-report.txt`
  document.body.append(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
