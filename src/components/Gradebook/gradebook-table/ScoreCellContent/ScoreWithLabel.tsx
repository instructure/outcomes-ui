import React from 'react'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { ScoreDisplayFormat } from '@/util/gradebook/constants'
import type { MasteryLevel } from '@/types/gradebook'
import { MasteryLevelIcon } from '@/components/Gradebook/icons/MasteryLevelIcon'

export interface ScoreWithLabelProps {
  masteryLevel: MasteryLevel
  score: number
  label: string
  scoreDisplayFormat?: ScoreDisplayFormat
}

interface LabelProps {
  scoreDisplayFormat: ScoreDisplayFormat
  score: number
  text: string
}

const Label: React.FC<LabelProps> = ({scoreDisplayFormat, score, text}) => {
  if (scoreDisplayFormat === ScoreDisplayFormat.ICON_AND_LABEL) {
    return <Text size="legend">{text}</Text>
  }

  if (scoreDisplayFormat === ScoreDisplayFormat.ICON_AND_POINTS) {
    return <Text size="legend">{score}</Text>
  }
}

export const ScoreWithLabel: React.FC<ScoreWithLabelProps> = ({
  masteryLevel,
  score,
  label,
  scoreDisplayFormat = ScoreDisplayFormat.ICON_ONLY,
}) => {
  const justifyItems = scoreDisplayFormat === ScoreDisplayFormat.ICON_ONLY ? 'center' : 'start'

  return (
    <Flex
      width="100%"
      height="100%"
      alignItems="center"
      gap="small"
      padding="none medium-small"
      justifyItems={justifyItems}
    >
      <MasteryLevelIcon
        masteryLevel={masteryLevel}
        width="1.5rem"
        height="1.5rem"
        ariaLabel={label}
        ariaHidden={scoreDisplayFormat === ScoreDisplayFormat.ICON_AND_LABEL}
      />

      <Label
        scoreDisplayFormat={scoreDisplayFormat}
        score={score}
        text={label}
      />
    </Flex>
  )
}
