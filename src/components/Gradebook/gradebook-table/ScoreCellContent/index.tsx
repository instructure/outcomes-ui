import React, { useState } from 'react'
import t from 'format-message'
import { View, type ViewProps } from '@instructure/ui-view'
import { Flex } from '@instructure/ui-flex'
import { IconButton } from '@instructure/ui-buttons'
import { ScoreWithLabel, type ScoreWithLabelProps } from './ScoreWithLabel'

export type ScoreCellContentProps = ScoreWithLabelProps & {
  onAction?: () => void
  actionScreenReaderLabel?: string
  actionIcon?: React.ReactNode
  focus?: boolean
  hover?: boolean
  background?: ViewProps['background']
}

export const ScoreCellContent: React.FC<ScoreCellContentProps> = ({
  masteryLevel,
  scoreDisplayFormat,
  score,
  totalScore,
  label,
  iconColor,
  onAction,
  actionScreenReaderLabel,
  actionIcon,
  focus,
  hover: hoverControlled,
  background = 'primary',
}: ScoreCellContentProps) => {
  const [hoverInternal, setHoverInternal] = useState(false)
  const hover = hoverControlled ?? hoverInternal

  const showAction = onAction && (focus || hover)

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
            totalScore={totalScore}
            scoreDisplayFormat={scoreDisplayFormat}
            label={label}
            iconColor={iconColor}
          />
        </Flex.Item>
      </Flex>
      {onAction && (
        <div
          data-testid="score-cell-action-wrapper"
          style={{
            opacity: showAction ? 1 : 0,
            pointerEvents: showAction ? 'auto' : 'none',
          }}
        >
          <View
            position="absolute"
            insetInlineEnd="0"
            insetBlockStart="50%"
            style={{ transform: 'translateY(-50%)' }}
          >
            <IconButton
              aria-haspopup="dialog"
              withBackground={false}
              withBorder={false}
              size="small"
              margin="0 xxx-small 0 0"
              renderIcon={actionIcon}
              screenReaderLabel={actionScreenReaderLabel || t('View Contributing Score Details')}
              onClick={onAction}
              data-testid="score-cell-action-button"
            />
          </View>
        </div>
      )}
    </View>
  )
}
