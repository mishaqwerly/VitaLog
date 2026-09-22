import type { SVGProps } from 'react'
import BrandMark from './BrandMark'

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 160 48"
    width="160"
    height="48"
    role="img"
    aria-label="VitaLog"
    focusable="false"
    {...props}
  >
    <BrandMark x="0" y="0" width="48" height="48" aria-hidden="true" />
    <text
      x="56"
      y="31"
      fill="currentColor"
      fontFamily="Manrope, Segoe UI, sans-serif"
      fontSize="23"
      fontWeight="800"
      letterSpacing="-0.8"
    >
      Vita
    </text>
    <text
      x="99"
      y="31"
      fill="var(--color-accent)"
      fontFamily="Manrope, Segoe UI, sans-serif"
      fontSize="23"
      fontWeight="800"
      letterSpacing="-0.8"
    >
      Log
    </text>
  </svg>
)

export default Logo
