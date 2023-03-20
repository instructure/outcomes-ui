import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import t from 'format-message'
import {Alert} from '@instructure/ui-alerts'
import {Link} from '@instructure/ui-link'
import {Text} from '@instructure/ui-text'
import {PresentationContent, ScreenReaderContent} from '@instructure/ui-a11y-content'
import {Transition} from '@instructure/ui-motion'
import {findDetailMessage, isLoadingChunkError} from '../../util/flashAlertUtils'

/*
 * Note: This file is copied over from canvas-lms/ui/shared/alerts/react/FlashAlert.js
 * It has a few minor changes so that it works with outcomes-ui, but is overall
 * pretty much the same and it works the same. Some functions were moved into a utils
 * file for testing purposes.
 */

const messageHolderId = 'flashalert_message_holder' // specs fail if I reuse jquery's elements
const screenreaderMessageHolderId = 'flash_screenreader_holder'
export const defaultTimeout = 10000

export function showFlashAlert({message, err, type = err ? 'error' : 'info', timeout = defaultTimeout, srOnly = false}) {
  function closeAlert(atNode) {
    ReactDOM.unmountComponentAtNode(atNode)
    atNode.remove()
  }

  function getAlertContainer() {
    let alertContainer = document.getElementById(messageHolderId)
    if (!alertContainer) {
      alertContainer = document.createElement('div')
      alertContainer.classList.add('clickthrough-container')
      alertContainer.id = messageHolderId
      alertContainer.setAttribute(
        'style',
        'position: fixed; top: 0; left: 0; width: 100%; z-index: 100000;'
      )
      document.body.appendChild(alertContainer)
    }
    return alertContainer
  }

  function renderAlert(parent) {
    ReactDOM.render(
      <FlashAlert
        message={message}
        timeout={timeout}
        error={err}
        variant={type}
        onClose={closeAlert.bind(null, parent)}
        screenReaderOnly={srOnly}
      />,
      parent
    )
  }

  const div = document.createElement('div')
  // div.setAttribute('class', styles.flashMessage)
  div.setAttribute('style', 'max-width:50em;margin:1rem auto;')
  div.setAttribute('class', 'flashalert-message')
  getAlertContainer().appendChild(div)
  renderAlert(div)
}

export function destroyContainer() {
  const container = document.getElementById(messageHolderId)
  const liveRegion = document.getElementById(screenreaderMessageHolderId)
  if (container) container.remove()
  if (liveRegion) liveRegion.remove()
}

export function showFlashError(message = t('An error occurred making a network request')) {
  return err => showFlashAlert({message, err, type: 'error'})
}

export function showFlashSuccess(message) {
  return () => showFlashAlert({message, type: 'success'})
}

// An Alert with a message and "Details" button which surfaces
// more info about the error when pressed.
// Is displayed at the top of the document, and will close itself after a while
class FlashAlert extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    error: PropTypes.instanceOf(Error),
    variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    timeout: PropTypes.number,
    screenReaderOnly: PropTypes.bool,
  }

  static defaultProps = {
    error: null,
    variant: 'info',
    timeout: defaultTimeout,
    screenReaderOnly: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      showDetails: false,
      isOpen: true,
    }
    this.timerId = 0
  }

  getLiveRegion() {
    // return element where flash screenreader messages go.
    // create if necessary
    let liveRegion = document.getElementById(screenreaderMessageHolderId)
    if (!liveRegion) {
      liveRegion = document.createElement('div')
      liveRegion.id = screenreaderMessageHolderId
      liveRegion.setAttribute('role', 'alert')
      document.body.appendChild(liveRegion)
    }
    return liveRegion
  }

  showDetails = () => {
    this.setState({showDetails: true})
    clearTimeout(this.timerId)
    this.timerId = setTimeout(() => this.closeAlert(), this.props.timeout)
  }

  closeAlert = () => {
    this.setState({isOpen: false}, () => {
      setTimeout(() => {
        clearTimeout(this.timerId)
        this.props.onClose()
      }, 500)
    })
  }

  renderDetailMessage(a, b) {
    const showPrimaryDetails = a && !isLoadingChunkError(a)
    const showSecondaryDetails = b && !isLoadingChunkError(b)

    return (
      <Text as="p" fontStyle="italic">
        {showPrimaryDetails && <Text>{a}</Text>}
        {showSecondaryDetails && (
          <>
            <br />
            <Text>{b}</Text>
          </>
        )}
      </Text>
    )
  }

  render() {
    let details = null
    if (this.props.error) {
      const {a, b} = findDetailMessage(this.props.error)
      const showPrimaryDetails = a && !isLoadingChunkError(a)
      const showSecondaryDetails = b && !isLoadingChunkError(b)

      if (showPrimaryDetails || showSecondaryDetails) {
        if (this.state.showDetails) {
          details = this.renderDetailMessage(a, b)
        } else {
          details = (
            <span>
              <PresentationContent>
                <Link isWithinText={false} as="button" onClick={this.showDetails}>
                  {t('Details')}
                </Link>
              </PresentationContent>
              <ScreenReaderContent>{this.renderDetailMessage(a, b)}</ScreenReaderContent>
            </span>
          )
        }
      }
    }

    return (
      <Transition transitionOnMount={true} in={this.state.isOpen} type="fade">
        <Alert
          variant={this.props.variant}
          renderCloseButtonLabel={t('Close')}
          onDismiss={this.closeAlert}
          margin="small auto"
          timeout={this.props.timeout}
          liveRegion={this.getLiveRegion}
          transition="fade"
          screenReaderOnly={this.props.screenReaderOnly}
        >
          <div>
            <p style={{margin: '0 -5px'}}>{this.props.message}</p>
            {details}
          </div>
        </Alert>
      </Transition>
    )
  }
}

export default FlashAlert
