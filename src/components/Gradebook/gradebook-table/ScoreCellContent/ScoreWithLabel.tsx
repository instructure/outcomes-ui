import React from 'react'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { ScoreDisplayFormat } from '@/util/gradebook/constants'
import type { MasteryLevel } from '@/types/gradebook'
import { MasteryLevelIcon } from '@/components/Gradebook/icons/MasteryLevelIcon'

export interface ScoreWithLabelProps {
  masteryLevel: MasteryLevel
  label: string
  score?: number
  totalScore?: number
  scoreDisplayFormat?: ScoreDisplayFormat
}

interface LabelProps {
  scoreDisplayFormat: ScoreDisplayFormat
  text: string
  score?: number
  totalScore?: number
}

const Label: React.FC<LabelProps> = ({scoreDisplayFormat, score, totalScore, text}) => {
  if (scoreDisplayFormat === ScoreDisplayFormat.ICON_AND_LABEL) {
    return <Text size="legend">{text}</Text>
  }

  if (scoreDisplayFormat === ScoreDisplayFormat.ICON_AND_POINTS) {
    return <Text size="legend">{score}</Text>
  }

  const isPercentFormat = scoreDisplayFormat === ScoreDisplayFormat.PERCENT
  const isPercentAndRatioFormat = scoreDisplayFormat === ScoreDisplayFormat.PERCENT_AND_RATIO

  if (isPercentFormat || isPercentAndRatioFormat) {
    const percent = score != null && totalScore != null && totalScore !== 0
      ? `${Math.round((score / totalScore) * 100)}%`
      : null

    return percent != null ? (
      <Flex gap="x-small">
        <Text weight="bold">{percent}</Text>
        {isPercentAndRatioFormat && <Text>{`(${score}/${totalScore})`}</Text>}
      </Flex>
    ) : null
  }
}

export const ScoreWithLabel: React.FC<ScoreWithLabelProps> = ({
  masteryLevel,
  score,
  totalScore,
  label,
  scoreDisplayFormat = ScoreDisplayFormat.ICON_ONLY,
}) => {
  const isPercentFormat = [
    ScoreDisplayFormat.PERCENT,
    ScoreDisplayFormat.PERCENT_AND_RATIO
  ].includes(scoreDisplayFormat)
  const justifyItems = scoreDisplayFormat === ScoreDisplayFormat.ICON_ONLY ? 'center' : 'start'

  return (
    <Flex
      width="100%"
      height="100%"
      alignItems="center"
      gap="small"
      padding="none small"
      justifyItems={justifyItems}
    >
      {!isPercentFormat && (
        <MasteryLevelIcon
          masteryLevel={masteryLevel}
          width="1.5rem"
          height="1.5rem"
          ariaLabel={label}
          ariaHidden={scoreDisplayFormat === ScoreDisplayFormat.ICON_AND_LABEL}
        />
      )}

      <Label
        scoreDisplayFormat={scoreDisplayFormat}
        score={score}
        totalScore={totalScore}
        text={label}
      />
    </Flex>
  )
}
