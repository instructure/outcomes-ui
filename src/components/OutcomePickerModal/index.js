import React from 'react'
import PropTypes from 'prop-types'
import { Button, CloseButton } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-text'
import { Heading } from '@instructure/ui-heading'
import { Modal } from '@instructure/ui-modal'
import t from 'format-message'

import OutcomePickerLoader from '../OutcomePickerLoader'
import {launchContextsShape} from '../../store/shapes'

const { Header: ModalHeader, Body: ModalBody, Footer: ModalFooter } = Modal

export default class OutcomePickerModal extends React.Component {
  static propTypes = {
    outcomePickerState: PropTypes.string.isRequired,
    resetOutcomePicker: PropTypes.func.isRequired,
    closeOutcomePicker: PropTypes.func.isRequired,
    loadOutcomePicker: PropTypes.func.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    saveOutcomePickerAlignments: PropTypes.func.isRequired,
    outcomePicker: PropTypes.func.isRequired,
    onModalClose: PropTypes.func,
    onModalOpen: PropTypes.func,
    onUpdate: PropTypes.func,
    anyOutcomeSelected: PropTypes.bool.isRequired,
    trigger: PropTypes.object,
    scope: PropTypes.string.isRequired,
    launchContexts: launchContextsShape,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    screenreaderNotification: PropTypes.func,
    liveRegion: Modal.propTypes.liveRegion,
    mountNode: Modal.propTypes.mountNode
  }

  static defaultProps = {
    onModalClose: null,
    onModalOpen: null,
    onUpdate: null,
    trigger: null,
    launchContexts: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
    screenreaderNotification: null,
    liveRegion: null,
    mountNode: null
  }

  handleModalReady() {
    if (this.props.onModalOpen) {
      this.props.onModalOpen()
    }
  }

  handleModalClose() {
    if (this.props.trigger) {
      // can be null during testing
      this.props.trigger.focus()
    }
    if (this.props.onModalClose) {
      this.props.onModalClose()
    }
  }

  handleModalRequestClose() {
    this.props.closeOutcomePicker()
  }

  handleModalExited() {
    this.props.resetOutcomePicker()
  }

  handleSubmit() {
    const { saveOutcomePickerAlignments, onUpdate } = this.props
    return saveOutcomePickerAlignments(onUpdate).then(() => this.handleModalRequestClose())
  }

  submitText() {
    switch (this.props.outcomePickerState) {
      case 'loading':
      case 'choosing':
        if (this.props.anyOutcomeSelected) {
          return t('Confirm Alignments')
        } else {
          return t('Done')
        }
      case 'saving':
      case 'complete':
      default:
        return t('OK')
    }
  }

  render() {
    const disabled = this.props.outcomePickerState !== 'choosing'
    const open = this.props.outcomePickerState !== 'closed'
    const {
      outcomePickerState,
      outcomePicker,
      loadOutcomePicker,
      setFocusedOutcome,
      scope,
      launchContexts,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText,
      screenreaderNotification,
      liveRegion,
      mountNode
    } = this.props
    return (
      <span>
        <Modal
          open={open}
          shouldCloseOnDocumentClick={false}
          onOpen={() => this.handleModalReady()}
          onClose={() => this.handleModalClose()}
          onDismiss={() => this.handleModalRequestClose()}
          onExited={() => this.handleModalExited()}
          transition="fade"
          size="fullscreen"
          label={t('Align Outcomes')}
          zIndex="9998"
          liveRegion={liveRegion}
          mountNode={mountNode}
          overflow="fit"
          data-automation="outcomePicker__modal"
        >
          <ModalHeader data-automation="outcomePicker__modalHeader">
            <CloseButton
              offset="medium"
              onClick={() => this.handleModalRequestClose()}
              placement="end"
              screenReaderLabel={t('Cancel')}
            />
            <Heading>
              <Text size="large">{t('Attached Outcomes')}</Text>
            </Heading>
          </ModalHeader>
          <ModalBody padding="0" data-automation="outcomePicker__modalBody">
            {
              // We need to conditionally render OutcomePickerLoader here to
              // work around an instui bug:
              // https://instructure.atlassian.net/browse/INSTUI-1437. The bug
              // causes the OutcomePickerLoader to unmount, re-mount, and
              // unmount again when the modal is closed. When this happens,
              // OutcomePickerLoader triggers the loadOutcomePicker action,
              // which resets the modal state to 'open'.
              // TODO: remove `open && ` when INSTUI-1437 is fixed
              open && (
                <OutcomePickerLoader
                  {...{
                    outcomePickerState,
                    outcomePicker,
                    loadOutcomePicker,
                    setFocusedOutcome,
                    scope,
                    launchContexts,
                    artifactTypeName,
                    displayMasteryDescription,
                    displayMasteryPercentText,
                    screenreaderNotification
                  }}
                />
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button
              margin="xxx-small"
              onClick={() => this.handleModalRequestClose()}
              disabled={disabled}
              data-testid="outcomePicker__cancelButton"
            >
              {t('Cancel')}
            </Button>
            <Button
              margin="xxx-small"
              onClick={() => this.handleSubmit()}
              color="primary"
              disabled={disabled}
              data-testid="outcomePicker__submitButton"
            >
              {this.submitText()}
            </Button>
          </ModalFooter>
        </Modal>
      </span>
    )
  }
}
