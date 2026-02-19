import React, { useState } from 'react'
import t from 'format-message'
import { View, type ViewProps } from '@instructure/ui-view'
import { Flex } from '@instructure/ui-flex'
import { IconButton } from '@instructure/ui-buttons'
import { IconExpandStartLine } from '@instructure/ui-icons'
import { ScoreWithLabel, type ScoreWithLabelProps } from './ScoreWithLabel'

export type ScoreCellContentProps =  ScoreWithLabelProps & {
  onAction?: () => void
  focus?: boolean
  hover?: boolean
  background?: ViewProps['background']
}

export const ScoreCellContent: React.FC<ScoreCellContentProps> = ({
  masteryLevel,
  scoreDisplayFormat,
  score,
  label,
  onAction,
  focus,
  hover: hoverControlled,
  background = 'primary',
}: ScoreCellContentProps) => {
  const [hoverInternal, setHoverInternal] = useState(false)
  const hover = hoverControlled ?? hoverInternal

  const showAction = focus || hover

  const handleMouseEnter = (): void => {
    if (hoverControlled === undefined) {
      setHoverInternal(true)
    }
  }

  const handleMouseLeave = (): void => {
    if (hoverControlled === undefined) {
      setHoverInternal(false)
    }
  }

  return (
    <View
      as="div"
      background={background}
      height="100%"
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="score-cell-content"
    >
      <Flex alignItems="center" width="100%" height="100%">
        <Flex.Item shouldGrow padding="xx-small 0">
          <ScoreWithLabel
            masteryLevel={masteryLevel}
            score={score}
            scoreDisplayFormat={scoreDisplayFormat}
            label={label}
          />
        </Flex.Item>
      </Flex>
      {showAction && (
        <View
          position="absolute"
          insetInlineEnd="0"
          insetBlockStart="50%"
          style={{ transform: 'translateY(-50%)' }}
        >
          <IconButton
            withBackground={false}
            withBorder={false}
            size="small"
            margin="0 xxx-small 0 0"
            renderIcon={<IconExpandStartLine />}
            screenReaderLabel={t('View Contributing Score Details')}
            onClick={onAction}
            disabled={!onAction}
            data-testid="score-cell-action-button"
          />
        </View>
      )}
    </View>
  )
}
