import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from '@instructure/ui-spinner'
import { Flex } from '@instructure/ui-flex'
import t from 'format-message'
import {launchContextsShape} from '../../store/shapes'

export default class OutcomePickerLoader extends React.Component {
  static propTypes = {
    loadOutcomePicker: PropTypes.func.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    outcomePickerState: PropTypes.string.isRequired,
    outcomePicker: PropTypes.elementType.isRequired,
    scope: PropTypes.string.isRequired,
    launchContexts: launchContextsShape,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    screenreaderNotification: PropTypes.func
  }

  static defaultProps = {
    launchContexts: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
    screenreaderNotification: null,
  }

  componentDidMount() {
    const { loadOutcomePicker } = this.props
    loadOutcomePicker()
  }

  render () {
    switch (this.props.outcomePickerState) {
      case 'loading':
        return (
          <Flex justifyItems="center">
            <Flex.Item padding="small">
              <Spinner renderTitle={t('Loading')} />
            </Flex.Item>
          </Flex>
        )
      case 'choosing': {
        const { outcomePicker: OutcomePicker } = this.props
        return (
          <OutcomePicker
            scope={this.props.scope}
            launchContexts={this.props.launchContexts}
            artifactTypeName={this.props.artifactTypeName}
            displayMasteryDescription={this.props.displayMasteryDescription}
            displayMasteryPercentText={this.props.displayMasteryPercentText}
            setFocusedOutcome={this.props.setFocusedOutcome}
            screenreaderNotification={this.props.screenreaderNotification}
          />
        )
      }
      case 'saving':
        return (
          <Flex justifyItems="center">
            <Flex.Item padding="small">
              <Spinner renderTitle={t('Saving')} />
            </Flex.Item>
          </Flex>
        )
      case 'complete':
        return (
          <div>{t('Complete')}</div>
        )
      case 'closed':
      default:
        return (
          <div />
        )
    }
  }
}
