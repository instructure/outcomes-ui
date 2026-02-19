import React from 'react'
import { Text } from '@instructure/ui-text'
import { Flex } from '@instructure/ui-flex'
import { IconButton } from '@instructure/ui-buttons'
import { IconMoreLine } from '@instructure/ui-icons'
import { Menu } from '@instructure/ui-menu'
import { View } from '@instructure/ui-view'
import { AccessibleContent } from '@instructure/ui-a11y-content'
import { CELL_HEIGHT } from '@/util/gradebook/constants'
import TruncateWithTooltip from '@/components/Gradebook/shared/TruncateWithTooltip'

export interface ColumnHeaderProps {
  title: string
  optionsMenuTriggerLabel?: string
  optionsMenuItems?: React.ReactNode[]
  columnWidth?: number
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  title,
  optionsMenuTriggerLabel,
  optionsMenuItems = [],
  columnWidth,
}) => {
  return (
    <View background="secondary" as="div" width={columnWidth} data-testid="column-header">
      <Flex
        alignItems="center"
        justifyItems="space-between"
        height={CELL_HEIGHT}
        padding="none xx-small"
      >
        <Flex.Item size="80%">
          <AccessibleContent alt={title}>
            <Text weight="bold">
              <TruncateWithTooltip>{title}</TruncateWithTooltip>
            </Text>
          </AccessibleContent>
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
