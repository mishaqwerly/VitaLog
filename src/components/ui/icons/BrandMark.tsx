import type { SVGProps } from 'react'

const BrandMark = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 104 104" focusable="false" {...props}>
    <g transform="rotate(-6 52 52)">
      <rect
        x="4"
        y="4"
        width="96"
        height="96"
        rx="30"
        fill="var(--color-accent-soft)"
      />
      <rect x="27" y="29" width="54" height="10" rx="5" fill="var(--color-accent)" />
      <rect x="27" y="47" width="54" height="10" rx="5" fill="var(--color-accent)" />
      <rect x="27" y="65" width="34" height="10" rx="5" fill="var(--color-accent)" />
    </g>
  </svg>
)

export default BrandMark
