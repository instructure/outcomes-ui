import React from 'react'
import t from 'format-message'
import { Flex } from '@instructure/ui-flex'
import { Menu } from '@instructure/ui-menu'
import {
  IconExpandStartLine,
  IconInfoLine,
  IconAnalyticsLine,
} from '@instructure/ui-icons'
import { SortOrder } from '@util/Gradebook/constants'

export interface OutcomeHeaderMenuProps {
  trigger: React.ReactElement
  isContributingScoresVisible: boolean
  sortOrder?: SortOrder
  onSortChange: (sortOrder: SortOrder) => void
  onContributingScoresToggle: () => void
  onShowOutcomeInfoClick: () => void
  onShowOutcomeDistributionClick: () => void
}

const OutcomeHeaderMenu: React.FC<OutcomeHeaderMenuProps> = ({
  trigger,
  isContributingScoresVisible,
  sortOrder,
  onSortChange,
  onContributingScoresToggle,
  onShowOutcomeInfoClick,
  onShowOutcomeDistributionClick,
}) => {
  return (
    <Menu trigger={trigger} placement="bottom">
      <Menu.Group label={t('Sort')} key="sort">
        <Menu.Item
          onSelect={() => onSortChange(SortOrder.ASC)}
          selected={sortOrder === SortOrder.ASC}
        >
          <Flex gap="x-small">
            {t('Ascending')}
          </Flex>
        </Menu.Item>

        <Menu.Item
          onSelect={() => onSortChange(SortOrder.DESC)}
          selected={sortOrder === SortOrder.DESC}
        >
          <Flex gap="x-small">
            {t('Descending')}
          </Flex>
        </Menu.Item>
      </Menu.Group>

      <Menu.Separator key="separator" />

      <Menu.Item onClick={onContributingScoresToggle}>
        <Flex gap="x-small">
          <IconExpandStartLine rotate={isContributingScoresVisible ? '180' : '0'} />
          {isContributingScoresVisible
            ? t('Hide Contributing Scores')
            : t('Show Contributing Scores')}
        </Flex>
      </Menu.Item>

      <Menu.Item onClick={onShowOutcomeInfoClick}>
        <Flex gap="x-small">
          <IconInfoLine />
          {t('Show Outcome Info')}
        </Flex>
      </Menu.Item>

      <Menu.Item onClick={onShowOutcomeDistributionClick}>
        <Flex gap="x-small">
          <IconAnalyticsLine />
          {t('Show Outcome Distribution')}
        </Flex>
      </Menu.Item>
    </Menu>
  )
}

export default OutcomeHeaderMenu
