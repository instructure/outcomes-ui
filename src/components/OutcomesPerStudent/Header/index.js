/** @jsx jsx */
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
import { TruncateText } from '@instructure/ui-truncate-text'
import { withStyle, jsx } from '@instructure/emotion'
import OutcomeViewModal from '../../OutcomeViewModal'
import HeaderDetails from '../HeaderDetails'
import generateComponentTheme from '../../theme'
import generateStyle from './styles'
import { stylesShape } from '../../../store/shapes'

@withStyle(generateStyle, generateComponentTheme)
export default class Header extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomeResult: PropTypes.object.isRequired,
    getReportOutcome: PropTypes.func.isRequired,
    viewReportAlignment: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeReportAlignment: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    showRollups: PropTypes.bool,
    styles: stylesShape,
  }

  // eslint-disable-next-line no-undef
  static defaultProps = {
    showRollups: true
  }

  constructor(props) {
    super(props)
    this.state = { showTooltip: false }
  }

  handleUpdate = (isTruncated) => {
    if (isTruncated !== this.state.showTooltip) {
      this.setState({ showTooltip: isTruncated })
    }
  }

  renderTitle = (outcome) => {
    const { viewReportAlignment } = this.props
    return (
      <Link onClick={viewReportAlignment}>
        <Text size="medium" transform="uppercase">
          <TruncateText
            maxLines={1}
            position={'middle'}
            onUpdate={this.handleUpdate}
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
      <div css={this.props.styles.header}>
        {showTooltip ? (
          <Tooltip renderTip={outcome.title} placement="bottom" color="primary">
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
