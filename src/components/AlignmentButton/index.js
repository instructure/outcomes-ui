import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { AccessibleContent } from '@instructure/ui-a11y-content'
import { Button, IconButton } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-text'
import {
  IconArrowOpenEndLine,
  IconArrowOpenDownLine,
  IconOutcomesLine,
  IconPlusLine
} from '@instructure/ui-icons'
import { List } from '@instructure/ui-list'
import { themeable } from '@instructure/ui-themeable'
import OutcomePickerModal from '../OutcomePickerModal'
import AlignmentItem from '../AlignmentItem'
import AlignmentCount from '../AlignmentCount'
import { outcomeShape } from '../../store/shapes'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class AlignmentButton extends React.Component {
  static propTypes = {
    alignedOutcomes: PropTypes.arrayOf(outcomeShape).isRequired,
    pickerProps: PropTypes.object,
    scope: PropTypes.string.isRequired,
    tray: PropTypes.elementType.isRequired,
    openOutcomePicker: PropTypes.func.isRequired,
    removeAlignment: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    screenreaderNotification: PropTypes.func,
    liveRegion: OutcomePickerModal.propTypes.liveRegion,
    canManageOutcomes: PropTypes.bool.isRequired
  }

  static defaultProps = {
    alignedOutcomes: [],
    pickerProps: {},
    onUpdate: null,
    screenreaderNotification: null,
    liveRegion: null,
    canManageOutcomes: true
  }

  constructor(props) {
    super(props)
    this.state = {
      renderCollapsed: true,
      focusedItem: null
    }
  }

  componentDidUpdate(oldProps) {
    const { alignedOutcomes } = this.props
    if (oldProps.alignedOutcomes.length && !alignedOutcomes.length) {
      if (this.align) {
        this.align.focus()
      }
    }
  }

  handleRemoveAlignment(removedOutcome, index) {
    const { removeAlignment, onUpdate, alignedOutcomes } = this.props
    removeAlignment(removedOutcome.id, onUpdate, true)
    this.props.screenreaderNotification(
      t('{label} alignment removed', { label: removedOutcome.label })
    )
    const priorIndex = index - 1
    if (priorIndex >= 0) {
      this.setState({focusedItem: priorIndex})
    } else if (alignedOutcomes.length > 0) {
      const nextIndex = index + 1
      if (nextIndex < alignedOutcomes.length) {
        this.setState({focusedItem: nextIndex})
      }
    }
  }

  toggleAlignmentList = () => {
    this.setState((prevState) => ({
      renderCollapsed: !prevState.renderCollapsed
    }))
  }

  renderHeader = () => {
    const { canManageOutcomes, alignedOutcomes } = this.props
    const { renderCollapsed } = this.state
    const enableToggleAction = alignedOutcomes.length > 0
    if (!enableToggleAction) {
      this.setState({renderCollapsed: true})
    }
    if (canManageOutcomes || alignedOutcomes.length) {
      return (
        <div
          className={styles.line}
          data-automation="outcomeLabel__alignedOutcomes"
          style={{'align-items': 'center'}}
        >
          <Text size="medium">
            <div className={styles.spacing}>
              <span style={{'padding-right': '0.5em'}}>
                <IconButton
                  size="small"
                  screenReaderLabel={
                    renderCollapsed
                      ? t('Expand the list of aligned Outcomes')
                      : t('Collapse the list of aligned Outcomes')
                  }
                  withBackground={false}
                  withBorder={false}
                  interaction={enableToggleAction ? 'enabled' : 'disabled' }
                  onClick={this.toggleAlignmentList}
                  data-automation="alignmentButton__collapseButton"
                >
                  {renderCollapsed ? (
                    <IconArrowOpenEndLine data-testid="icon-arrow-right" />
                  ) : (
                    <IconArrowOpenDownLine data-testid="icon-arrow-down" />
                  )}
                </IconButton>
              </span>
              <IconOutcomesLine />
            </div>
          </Text>
          <Text size="medium">
            <div className={styles.spacing}>
              {t('Aligned Outcomes')} &nbsp;
              <AlignmentCount count={alignedOutcomes.length} />
            </div>
          </Text>
        </div>
      )
    }
  }

  renderAlignmentList = () => {
    if (this.state.renderCollapsed) {
      return
    }

    const { alignedOutcomes, canManageOutcomes } = this.props
    return (
      <List isUnstyled margin="small 0" delimiter="solid">
        { /* We render this empty list item to render a delimiter at the top of the list */}
        {alignedOutcomes.length > 0 && (<List.Item key='delimiter-0'/>)}
        {alignedOutcomes.map((outcome, index) => {
          return (
            <List.Item padding="0 small 0 medium" key={outcome.id}>
              <AlignmentItem
                removeAlignment={() =>
                  this.handleRemoveAlignment(outcome, index)
                }
                outcome={outcome}
                canManageOutcomes={canManageOutcomes}
                shouldFocus={index === this.state.focusedItem}
              />
            </List.Item>
          )
        })}
        { /* We render this empty list item to render a delimiter at the end of the list */}
        {alignedOutcomes.length > 0 && (<List.Item key='delimiter-1'/>)}
      </List>
    )
  }

  renderTray = () => {
    const {
      pickerProps,
      scope,
      tray: OutcomeTray,
      liveRegion,
      screenreaderNotification
    } = this.props
    return (
      <OutcomeTray
        screenreaderNotification={screenreaderNotification}
        liveRegion={liveRegion}
        scope={scope}
        shouldModifyArtifact
        {...pickerProps}
      />
    )
  }

  renderButton = () => {
    const { openOutcomePicker, canManageOutcomes } = this.props
    if (canManageOutcomes) {
      return (
        <div className={styles.button}>
          <Button
            ref={(d) => {
              this.align = d
            }} // eslint-disable-line immutable/no-mutation
            icon={IconPlusLine}
            onClick={openOutcomePicker}
            data-automation="alignmentButton__button"
          >
            <AccessibleContent alt={t('Align Outcomes')}>
              {t('Outcome')}
            </AccessibleContent>
          </Button>
        </div>
      )
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.renderHeader()}
        {this.renderAlignmentList()}
        {this.renderButton()}
        {this.renderTray()}
      </React.Fragment>
    )
  }
}
