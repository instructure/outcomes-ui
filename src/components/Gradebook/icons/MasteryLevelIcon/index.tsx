import type { MasteryLevel } from '@/types/gradebook'
import React, { SVGProps } from 'react'
import { ExceedsMasteryIcon } from './ExceedsMasteryIcon'
import { MasteryIcon } from './MasteryIcon'
import { NearMasteryIcon } from './NearMasteryIcon'
import { RemediationIcon } from './RemediationIcon'
import { NoEvidenceIcon } from './NoEvidenceIcon'
import { UnassessedIcon } from './UnassessedIcon'

export interface MasteryLevelIconProps {
  masteryLevel: MasteryLevel
  fill?: string
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
  ariaHidden?: boolean
  ariaLabel?: string
}

const MASTERY_LEVEL_ICONS: Record<
  MasteryLevel,
  React.ComponentType<SVGProps<SVGSVGElement>>
> = {
  exceeds_mastery: ExceedsMasteryIcon,
  mastery: MasteryIcon,
  near_mastery: NearMasteryIcon,
  remediation: RemediationIcon,
  no_evidence: NoEvidenceIcon,
  unassessed: UnassessedIcon,
}

export const MasteryLevelIcon: React.FC<MasteryLevelIconProps> = ({
  masteryLevel,
  fill,
  width,
  height,
  style,
  ariaHidden,
  ariaLabel,
}) => {
  const Icon = MASTERY_LEVEL_ICONS[masteryLevel]

  if (!Icon) {
    console.warn(`MasteryLevelIcon: No icon found for mastery level "${masteryLevel}"`)
    return null
  }

  return (
    <Icon
      fill={fill}
      width={width}
      height={height}
      style={style}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  )
}

export default MasteryLevelIcon
