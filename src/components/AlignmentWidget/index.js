/** @jsx jsx */
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
import { withStyle, jsx } from '@instructure/emotion'
import OutcomePickerModal from '../OutcomePickerModal'
import AlignmentItem from '../AlignmentItem'
import AlignmentCount from '../AlignmentCount'
import { outcomeShape, stylesShape } from '../../store/shapes'
import generateComponentTheme from '../theme'
import generateStyle from './styles'


@withStyle(generateStyle, generateComponentTheme)
export default class AlignmentWidget extends React.Component {
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
    canManageOutcomes: PropTypes.bool.isRequired,
    showAlert: PropTypes.func,
    features: PropTypes.array,
    styles: stylesShape,
  }

  static defaultProps = {
    alignedOutcomes: [],
    pickerProps: {},
    onUpdate: null,
    screenreaderNotification: null,
    liveRegion: null,
    canManageOutcomes: true,
    showAlert: () => {},
    features: []
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

  componentDidMount() {
    const { alignedOutcomes } = this.props
    if (alignedOutcomes.length === 0) {
      this.setState({ renderCollapsed: true })
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
      this.setState({ focusedItem: priorIndex })
    } else if (alignedOutcomes.length > 0) {
      const nextIndex = index + 1
      if (nextIndex < alignedOutcomes.length) {
        this.setState({ focusedItem: nextIndex })
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
    if (canManageOutcomes || alignedOutcomes.length) {
      return (
        <div
          css={this.props.styles.line}
          data-automation="outcomeLabel__alignedOutcomes"
          style={{ alignItems: 'center' }}
        >
          <Text size="medium">
            <div css={this.props.styles.spacing}>
              <span style={{ paddingRight: '0.5em' }}>
                <IconButton
                  size="small"
                  screenReaderLabel={
                    renderCollapsed
                      ? t('Expand the list of aligned Outcomes')
                      : t('Collapse the list of aligned Outcomes')
                  }
                  withBackground={false}
                  withBorder={false}
                  interaction={enableToggleAction ? 'enabled' : 'disabled'}
                  onClick={this.toggleAlignmentList}
                  data-automation="alignmentWidget__collapseButton"
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
            <div css={this.props.styles.spacing}>
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
    const { alignedOutcomes, canManageOutcomes, features } = this.props
    return (
      <List isUnstyled margin='small 0'>
        {/* We render this empty list item to render a delimiter at the top of the list */}
        {alignedOutcomes.length > 0 && <List.Item key="delimiter-0"><div/></List.Item>}
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
                features={features}
              />
            </List.Item>
          )
        })}
        {/* We render this empty list item to render a delimiter at the end of the list */}
        {alignedOutcomes.length > 0 && <List.Item key="delimiter-1"><div/></List.Item>}
      </List>
    )
  }

  renderTray = () => {
    const {
      pickerProps,
      scope,
      tray: OutcomeTray,
      liveRegion,
      screenreaderNotification,
      showAlert,
      features
    } = this.props
    return (
      <OutcomeTray
        screenreaderNotification={screenreaderNotification}
        liveRegion={liveRegion}
        scope={scope}
        shouldModifyArtifact
        showAlert={showAlert}
        features={features}
        {...pickerProps}
      />
    )
  }

  renderButton = () => {
    const { openOutcomePicker, canManageOutcomes } = this.props
    if (canManageOutcomes) {
      return (
        <div css={this.props.styles.button}>
          <Button
            ref={(d) => {
              this.align = d
            }} // eslint-disable-line immutable/no-mutation
            renderIcon={IconPlusLine}
            onClick={openOutcomePicker}
            data-automation="alignmentWidget__button"
          >
            <AccessibleContent alt={t('Align Outcomes')} data-automation="alignmentWidget__AccessibleContent" >
              {t('Outcome')}
            </AccessibleContent>
          </Button>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderAlignmentList()}
        {this.renderButton()}
        {this.renderTray()}
      </div>
    )
  }
}
