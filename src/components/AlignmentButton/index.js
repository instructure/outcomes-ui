import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { AccessibleContent } from '@instructure/ui-a11y'
import { Button } from '@instructure/ui-buttons'
import { IconPlusLine } from '@instructure/ui-icons'
import OutcomePickerModal from '../OutcomePickerModal'

export default class AlignmentButton extends React.Component {
  static propTypes = {
    pickerProps: PropTypes.object,
    scope: PropTypes.string.isRequired,
    tray: PropTypes.elementType.isRequired,
    openOutcomePicker: PropTypes.func.isRequired,
    screenreaderNotification: PropTypes.func,
    liveRegion: OutcomePickerModal.propTypes.liveRegion,
  }

  static defaultProps = {
    pickerProps: {},
    screenreaderNotification: null,
    liveRegion: null,
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
        <Button icon={IconPlusLine} onClick={openOutcomePicker}>
          <AccessibleContent alt={t('Align Outcomes')}>
            {t('Outcome')}
          </AccessibleContent>
        </Button>
        { this.renderTray() }
      </React.Fragment>
    )
  }
}
