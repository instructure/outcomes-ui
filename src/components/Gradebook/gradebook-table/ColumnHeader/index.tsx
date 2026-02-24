import React from 'react'
import { Text } from '@instructure/ui-text'
import { Flex } from '@instructure/ui-flex'
import { IconButton } from '@instructure/ui-buttons'
import { IconMoreLine } from '@instructure/ui-icons'
import { Menu } from '@instructure/ui-menu'
import { View, type ViewProps } from '@instructure/ui-view'
import { AccessibleContent } from '@instructure/ui-a11y-content'
import { CELL_HEIGHT, COLUMN_WIDTH } from '@/util/gradebook/constants'
import TruncateWithTooltip from '@/components/Gradebook/shared/TruncateWithTooltip'
import { getInverseColor } from '@/util/gradebook/colors'

export interface ColumnHeaderProps {
  title: string
  optionsMenuTriggerLabel?: string
  optionsMenuItems?: React.ReactNode[]
  icon?: React.ReactNode
  background?: ViewProps['background']
  columnWidth?: number
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  title,
  optionsMenuTriggerLabel,
  optionsMenuItems = [],
  icon,
  background = 'secondary',
  columnWidth = COLUMN_WIDTH,
}) => {
  return (
    <View background={background} as="div" width={columnWidth} data-testid="column-header">
      <Flex
        alignItems="center"
        justifyItems="space-between"
        height={CELL_HEIGHT}
        padding="none none none x-small"
      >
        <Flex.Item shouldGrow shouldShrink overflowX="hidden">
          <Flex gap="x-small">
            {icon &&
              <Flex.Item padding="0 0 xx-small none">
                {icon}
              </Flex.Item>
            }

            <Flex.Item shouldGrow shouldShrink overflowX="hidden" padding="0 xx-small 0 0">
              <AccessibleContent alt={title}>
                <Text weight="bold">
                  <TruncateWithTooltip>{title}</TruncateWithTooltip>
                </Text>
              </AccessibleContent>
            </Flex.Item>
          </Flex>
        </Flex.Item>

        {optionsMenuItems.length > 0 && (
          <Menu
            placement="bottom"
            trigger={
              <IconButton
                withBorder={false}
                withBackground={false}
                size="small"
                screenReaderLabel={optionsMenuTriggerLabel}
                color={getInverseColor(background)}
              >
                <IconMoreLine />
              </IconButton>
            }
          >
            {optionsMenuItems}
          </Menu>
        )}
      </Flex>
    </View>
  )
}
