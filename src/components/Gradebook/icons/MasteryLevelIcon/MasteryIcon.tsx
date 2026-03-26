import React, { SVGProps } from 'react'

const SVG_PATHS: React.SVGProps<SVGPathElement>[] = [
  {
    d: 'M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9Z',
  },
] as const

export const DEFAULT_FILL_MASTERY = '#0B874B'

export const MasteryIcon = ({ fill = DEFAULT_FILL_MASTERY, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      id="mastery"
      width="18"
      height="18"
      viewBox="-1 -1 20 20"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mastery"
      {...props}
    >
      {SVG_PATHS.map((pathProps, index) => (
        <path key={index} {...pathProps} />
      ))}
    </svg>
  )
}

export const masteryIconSvgPaths = SVG_PATHS.map(p => `<path d="${p.d}"/>`).join('')
