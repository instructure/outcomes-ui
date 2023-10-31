import React from 'react'
import PropTypes from 'prop-types'
import { Button, CloseButton } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-text'
import { Heading } from '@instructure/ui-heading'
import { Modal } from '@instructure/ui-modal'
import { Focusable } from '@instructure/ui-focusable'
import t from 'format-message'
import { View } from '@instructure/ui-view'
import ConnectedOutcomeView from '../../containers/ConnectedOutcomeView'

const { Header: ModalHeader, Body: ModalBody, Footer: ModalFooter } = Modal

const OutcomeViewModal = (props) => {
  const {
    header,
    outcome,
    outcomeResult,
    artifactTypeName,
    displayMasteryDescription,
    displayMasteryPercentText,
    scope
  } = props
  const {
    title,
    description,
    scoring_method: scoringMethod,
    friendly_description: friendlyDescription
  } = outcome

  const scoringTiers = outcome.scoring_method
    ? outcome.scoring_method.scoring_tiers
    : []
  return (
    <Modal
      open={props.isOpen}
      shouldCloseOnDocumentClick
      onDismiss={() => props.closeAlignment()}
      onClose={() => {
        props.closeAlignment()
      }}
      transition="fade"
      size="fullscreen"
      label={t('Outcome')}
      zIndex="9999"
      data-automation="outcomeView__modal"
    >
      <ModalHeader>
        <CloseButton
          offset="medium"
          onClick={() => props.closeAlignment()}
          placement="end"
          data-automation="outcomeView__closeButton"
          screenReaderLabel={t('Close')}
        />
        <Heading>
          <Text size="large" data-automation="outcomeView__header">
            {header || t('View Outcome')}
          </Text>
        </Heading>
      </ModalHeader>
      <ModalBody padding="none">
        <Focusable>
          {({ focusVisible }) => (
            <View
              as="div"
              tabIndex="0"
              padding="medium"
              position="relative"
              focusPosition="inset"
              withFocusOutline={focusVisible}
            >
              <ConnectedOutcomeView
                scope={scope}
                description={description}
                title={title}
                scoringMethod={scoringMethod}
                scoringTiers={scoringTiers}
                artifactTypeName={artifactTypeName}
                displayMasteryDescription={displayMasteryDescription}
                displayMasteryPercentText={displayMasteryPercentText}
                outcomeResult={outcomeResult}
                friendlyDescription={friendlyDescription}
              />
            </View>
          )}
        </Focusable>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => props.closeAlignment()}
          color="primary"
          data-automation="outcomeView__submitButton"
        >
          {t('OK')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

OutcomeViewModal.propTypes = {
  outcome: PropTypes.shape({
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    scoring_method: PropTypes.object,
    friendly_description: PropTypes.string
  }).isRequired,
  outcomeResult: PropTypes.object,
  closeAlignment: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  artifactTypeName: PropTypes.string,
  displayMasteryDescription: PropTypes.bool,
  displayMasteryPercentText: PropTypes.bool,
  header: PropTypes.string,
  scope: PropTypes.string.isRequired
}

OutcomeViewModal.defaultProps = {
  outcomeResult: null,
  artifactTypeName: null,
  displayMasteryDescription: false,
  displayMasteryPercentText: false,
  header: null
}

export default OutcomeViewModal
