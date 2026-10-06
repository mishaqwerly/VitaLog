import { useMemo } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { DiagnosisHistoryEntry } from '../../types/patient'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

type BloodPressureChartProps = {
  entries: DiagnosisHistoryEntry[]
}

const MONTHS_TO_SHOW = 6

function getTimestamp(entry: DiagnosisHistoryEntry) {
  return new Date(`${entry.month} 1, ${entry.year}`).getTime()
}

const BloodPressureChart = ({ entries }: BloodPressureChartProps) => {
  const visibleEntries = useMemo(
    () =>
      [...entries]
        .sort((left, right) => getTimestamp(left) - getTimestamp(right))
        .slice(-MONTHS_TO_SHOW),
    [entries],
  )

  const data: ChartData<'line'> = {
    labels: visibleEntries.map(
      (entry) => `${entry.month.slice(0, 3)}, ${String(entry.year).slice(-2)}`,
    ),
    datasets: [
      {
        label: 'Systolic',
        data: visibleEntries.map((entry) => entry.bloodPressure.systolic.value),
        borderColor: '#853bce',
        backgroundColor: '#853bce',
        pointBackgroundColor: '#853bce',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Diastolic',
        data: visibleEntries.map((entry) => entry.bloodPressure.diastolic.value),
        borderColor: '#306ee8',
        backgroundColor: '#306ee8',
        pointBackgroundColor: '#306ee8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: true,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.formattedValue} mmHg`,
        },
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#6c6b77',
          maxRotation: 0,
          font: {
            family: 'Manrope',
            size: 11,
          },
        },
      },
      y: {
        suggestedMin: 60,
        suggestedMax: 180,
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(112, 112, 112, 0.16)',
        },
        ticks: {
          color: '#6c6b77',
          stepSize: 20,
          font: {
            family: 'Manrope',
            size: 11,
          },
        },
      },
    },
  }

  return (
    <Line
      data={data}
      options={options}
      role="img"
      aria-label="Blood pressure readings for the last six months"
    />
  )
}

export default BloodPressureChart
