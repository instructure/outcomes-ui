import React from 'react'
import PropTypes from 'prop-types'
import {
  AccessibleContent,
  PresentationContent
} from '@instructure/ui-a11y-content'
import { Text } from '@instructure/ui-text'
import { Link } from '@instructure/ui-link'
import { Tooltip } from '@instructure/ui-tooltip'
import t from 'format-message'
import { themeable } from '@instructure/ui-themeable'
import { TruncateText } from '@instructure/ui-truncate-text'

import OutcomeViewModal from '../../OutcomeViewModal'
import HeaderDetails from '../HeaderDetails'
import theme from '../../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class Header extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomeResult: PropTypes.object.isRequired,
    getReportOutcome: PropTypes.func.isRequired,
    viewReportAlignment: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeReportAlignment: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    showRollups: PropTypes.bool
  }

  // eslint-disable-next-line no-undef
  static defaultProps = {
    showRollups: true
  }

  constructor(props) {
    super(props)
    this.state = { showTooltip: false }
  }

  renderTitle = (outcome) => {
    const { viewReportAlignment } = this.props
    return (
      <Link onClick={viewReportAlignment}>
        <Text size="medium" transform="uppercase">
          <TruncateText
            maxLines={1}
            position={'middle'}
            onUpdate={(isTruncated) =>
              this.setState({ showTooltip: isTruncated })
            }
          >
            <AccessibleContent alt={outcome.title}>
              {outcome.title}
            </AccessibleContent>
          </TruncateText>
        </Text>
      </Link>
    )
  }

  render() {
    const {
      outcomeResult,
      getReportOutcome,
      isOpen,
      closeReportAlignment,
      showRollups,
      scope
    } = this.props
    const { showTooltip } = this.state
    const outcome = getReportOutcome(outcomeResult.outcomeId)
    return (
      <div className={styles.header}>
        {showTooltip ? (
          <Tooltip tip={outcome.title} placement="bottom" variant="inverse">
            {this.renderTitle(outcome)}
          </Tooltip>
        ) : (
          this.renderTitle(outcome)
        )}
        <PresentationContent>
          <HeaderDetails
            outcomeResult={outcomeResult}
            showRollups={showRollups}
          />
        </PresentationContent>
        <OutcomeViewModal
          header={t('Outcome Detail')}
          outcome={outcome}
          outcomeResult={outcomeResult}
          closeAlignment={closeReportAlignment}
          isOpen={isOpen}
          scope={scope}
          displayMasteryDescription
        />
      </div>
    )
  }
}
