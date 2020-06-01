import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { AccessibleContent } from '@instructure/ui-a11y'
import { Button } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-elements'
import { IconOutcomesLine, IconPlusLine } from '@instructure/ui-icons'
import { List } from '@instructure/ui-list'
import { themeable } from '@instructure/ui-themeable'
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
    readOnly: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    alignedOutcomes: [],
    pickerProps: {},
    onUpdate: null,
    screenreaderNotification: null,
    liveRegion: null,
    readOnly: false
  }

  componentDidUpdate (oldProps) {
    const { alignedOutcomes } = this.props
    if (oldProps.alignedOutcomes.length && !alignedOutcomes.length) {
      if (this.align) {
        this.align.focus()
      }
    }
  }

  handleRemoveAlignment (removedOutcome, index) {
    const { removeAlignment, onUpdate, alignedOutcomes } = this.props
    removeAlignment(removedOutcome.id, onUpdate, true)
    this.props.screenreaderNotification(t('{label} alignment removed', {label: removedOutcome.label}))
    const priorListItem = this[`position${index - 1}`]
    if (priorListItem) {
      priorListItem.focus()
    } else if (alignedOutcomes.length > 0) {
      const nextListItem = this[`position${index + 1}`]
      if (nextListItem) { nextListItem.focus() }
    }
  }

  renderHeader = () => {
    const { readOnly, alignedOutcomes } = this.props
    if(!readOnly || alignedOutcomes.length) {
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
              <AlignmentCount count={alignedOutcomes.length} />
            </div>
          </Text>
        </div>
      )
    }
  }

  renderAlignmentList = () => {
    const { alignedOutcomes, readOnly } = this.props
    return (
      <List isUnstyled margin="small 0" delimiter="solid">
        { alignedOutcomes.map((outcome, index) => {
          return (
            <List.Item margin="small 0" key={outcome.id}>
              <AlignmentItem
                removeAlignment={() => this.handleRemoveAlignment(outcome, index)}
                ref={(o) => { this[`position${index}`] = o }} // eslint-disable-line immutable/no-mutation
                outcome={outcome}
                readOnly={readOnly}
              />
            </List.Item>
          )
        })}
      </List>
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
        shouldModifyArtifact
        {...pickerProps}
      />
    )
  }

  renderButton = () => {
    const { openOutcomePicker, readOnly } = this.props
    if(!readOnly) {
      return (
        <div className={styles.button}>
          <Button
            ref={(d) => { this.align = d }} // eslint-disable-line immutable/no-mutation
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
        { this.renderHeader() }
        { this.renderAlignmentList() }
        { this.renderButton() }
        { this.renderTray() }
      </React.Fragment>
    )
  }
}
