import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { AccessibleContent } from '@instructure/ui-a11y'
import { Button } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-elements'
import { IconOutcomesLine, IconPlusLine } from '@instructure/ui-icons'
import { List } from '@instructure/ui-list'
import { themeable } from '@instructure/ui-themeable'
import { ToggleGroup } from '@instructure/ui-toggle-details'
import OutcomePickerModal from '../OutcomePickerModal'
import AlignmentItem from './AlignmentItem'
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
  }

  static defaultProps = {
    alignedOutcomes: [],
    pickerProps: {},
    onUpdate: null,
    screenreaderNotification: null,
    liveRegion: null,
  }

  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  componentDidUpdate (oldProps) {
    const { alignedOutcomes } = this.props
    if (oldProps.alignedOutcomes.length && !alignedOutcomes.length) {
      if (this.align) {
        this.align.focus()
      }
    }
  }

  handleRemoveAlignment (outcome, index) {
    const { removeAlignment, onUpdate, alignedOutcomes } = this.props
    removeAlignment(outcome.id, onUpdate)
    this.props.screenreaderNotification(t('{label} alignment removed', {label: outcome.label}))
    const priorListItem = this[`position${index - 1}`]
    if (priorListItem) {
      priorListItem.focus()
    } else if (alignedOutcomes.length > 0) {
      const nextListItem = this[`position${index + 1}`]
      if (nextListItem) { nextListItem.focus() }
    }
  }

  renderHeader = () => {
    return (
      <div className={styles.line} data-automation='outcomeLabel__alignedOutcomes'>
        <Text size="medium">
          <div className={styles.spacing}>
            <IconOutcomesLine />
          </div>
        </Text>
        <Text size="medium">
          <div className={styles.spacing}>
            {t('Aligned Outcomes')} &nbsp;
            <AlignmentCount count={this.props.alignedOutcomes.length} />
          </div>
        </Text>
      </div>
    )
  }

  handleToggle = (_event, expanded) => {
    this.setState({expanded})
  }

  renderAlignmentList = () => {
    const { alignedOutcomes } = this.props
    const { expanded } = this.state
    return (
      <ToggleGroup
        expanded={expanded}
        onToggle={this.handleToggle}
        toggleLabel={ expanded ? t('Click to hide alignments') : t('Click to show alignments')}
        border={false}
        summary={this.renderHeader()}
      >
        <List isUnstyled margin="small 0" delimiter="solid">
          { alignedOutcomes.map((outcome, index) => {
            return (
              <List.Item margin="small 0" key={outcome.id}>
                <AlignmentItem
                  removeAlignment={() => this.handleRemoveAlignment(outcome, index)}
                  ref={(o) => { this[`position${index}`] = o }} // eslint-disable-line immutable/no-mutation
                  outcome={outcome}
                />
              </List.Item>
            )
          })}
        </List>
      </ToggleGroup>
    )
  }

  renderTray = () => {
    const {
      pickerProps,
      scope,
      tray : OutcomeTray,
      liveRegion,
      screenreaderNotification,
    } = this.props
    return (
      <OutcomeTray
        screenreaderNotification={screenreaderNotification}
        liveRegion={liveRegion}
        scope={scope}
        {...pickerProps}
      />
    )
  }

  render() {
    const { openOutcomePicker } = this.props
    return (
      <React.Fragment>
        { this.renderAlignmentList() }
        <div className={styles.button}>
          <Button
            ref={(d) => { this.align = d }} // eslint-disable-line immutable/no-mutation
            icon={IconPlusLine}
            onClick={openOutcomePicker}
          >
            <AccessibleContent alt={t('Align Outcomes')}>
              {t('Outcome')}
            </AccessibleContent>
          </Button>
        </div>
        { this.renderTray() }
      </React.Fragment>
    )
  }
}
