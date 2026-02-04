import React, { useState } from 'react'
import { TruncateText } from '@instructure/ui-truncate-text'
import { Tooltip, type TooltipProps } from '@instructure/ui-tooltip'

interface TruncateWithTooltipProps {
  children: React.ReactNode
  placement?: TooltipProps['placement']
  /**
   * Allows you to constrain the max width of the tooltip to prevent it from
   * running off the screen.
   */
  maxTooltipWidth?: string | number
  linesAllowed?: number
  horizontalOffset?: number
  backgroundColor?: 'primary' | 'primary-inverse'
}

/**
 * Renders text that will truncate after a certain number of lines
 * and show a tooltip with the full text on hover if truncated.
 * There are a few versions of this in Canvas. However, this one is meant to be re-usable
 * everywhere.
 */
const TruncateWithTooltip = ({
  children,
  placement = 'top',
  maxTooltipWidth: maxWidth = '20rem',
  linesAllowed,
  horizontalOffset,
  backgroundColor,
}: TruncateWithTooltipProps) => {
  const [isTruncated, setIsTruncated] = useState(false)

  const handleUpdate = (truncated: boolean) => {
    if (truncated !== isTruncated) {
      setIsTruncated(truncated)
    }
  }

  return isTruncated ? (
    <Tooltip
      as="div"
      placement={placement}
      color={backgroundColor}
      offsetX={horizontalOffset}
      renderTip={() => <div style={{overflowWrap: 'break-word', maxWidth}}>{children}</div>}
    >
      <TruncateText
        maxLines={linesAllowed}
        ignore={[' ', '.', ',']}
        ellipsis=" ..."
        onUpdate={handleUpdate}
      >
        {children}
      </TruncateText>
    </Tooltip>
  ) : (
    <TruncateText maxLines={linesAllowed} onUpdate={handleUpdate}>
      {children}
    </TruncateText>
  )
}

export default TruncateWithTooltip
