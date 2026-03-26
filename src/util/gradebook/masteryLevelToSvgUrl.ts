import { DEFAULT_FILL_EXCEEDS_MASTERY, exceedsMasteryIconSvgPaths } from '@/components/Gradebook/icons/MasteryLevelIcon/ExceedsMasteryIcon'
import { DEFAULT_FILL_MASTERY, masteryIconSvgPaths } from '@/components/Gradebook/icons/MasteryLevelIcon/MasteryIcon'
import { DEFAULT_FILL_NEAR_MASTERY, nearMasteryIconSvgPaths } from '@/components/Gradebook/icons/MasteryLevelIcon/NearMasteryIcon'
import { DEFAULT_FILL_NO_EVIDENCE, noEvidenceIconSvgPaths } from '@/components/Gradebook/icons/MasteryLevelIcon/NoEvidenceIcon'
import { DEFAULT_FILL_REMEDIATION, remediationIconSvgPaths } from '@/components/Gradebook/icons/MasteryLevelIcon/RemediationIcon'
import { DEFAULT_FILL_UNASSESSED, unassessedIconSvgPaths } from '@/components/Gradebook/icons/MasteryLevelIcon/UnassessedIcon'
import type { MasteryLevel } from '@/types/gradebook'

const MASTERY_LEVEL_SVG_CONFIG: Record<MasteryLevel, { svgPaths: string; defaultFill: string }> = {
  exceeds_mastery: { svgPaths: exceedsMasteryIconSvgPaths, defaultFill: DEFAULT_FILL_EXCEEDS_MASTERY },
  mastery: { svgPaths: masteryIconSvgPaths, defaultFill: DEFAULT_FILL_MASTERY },
  near_mastery: { svgPaths: nearMasteryIconSvgPaths, defaultFill: DEFAULT_FILL_NEAR_MASTERY },
  no_evidence: { svgPaths: noEvidenceIconSvgPaths, defaultFill: DEFAULT_FILL_NO_EVIDENCE },
  remediation: { svgPaths: remediationIconSvgPaths, defaultFill: DEFAULT_FILL_REMEDIATION },
  unassessed: { svgPaths: unassessedIconSvgPaths, defaultFill: DEFAULT_FILL_UNASSESSED },
}

export interface MasteryIconOptions {
  fill?: string
}

export const masteryLevelToSvgUrl = (masteryLevel: MasteryLevel, options?: MasteryIconOptions) => {
  const config = MASTERY_LEVEL_SVG_CONFIG[masteryLevel]

  if (!config) {
    console.warn(`No SVG config found for mastery level "${masteryLevel}"`)
    return null
  }

  const { svgPaths, defaultFill } = config
  const fill = options?.fill
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 20 20" fill="${fill || defaultFill}">${svgPaths}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
