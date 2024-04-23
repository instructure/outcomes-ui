/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Billboard } from '@instructure/ui-billboard'
import { IconButton } from '@instructure/ui-buttons'
import { IconPlusLine } from '@instructure/ui-icons'
import { withStyle, jsx } from '@instructure/emotion'
import t from 'format-message'
import Alignment from '../Alignment'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import Clipboard from '../../icons/Clipboard.svg'
import OutcomePickerModal from '../OutcomePickerModal'
import { stylesShape } from '../../store/shapes'

@withStyle(generateStyle, generateComponentTheme)
class AlignmentList extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    addModal: PropTypes.func.isRequired,
    pickerType: PropTypes.string,
    pickerProps: PropTypes.object,
    alignedOutcomes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      })
    ).isRequired,
    emptySetHeading: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    removeAlignment: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    viewAlignment: PropTypes.func.isRequired,
    closeAlignment: PropTypes.func.isRequired,
    isOpen: PropTypes.func.isRequired,
    openOutcomePicker: PropTypes.func.isRequired,
    onModalOpen: PropTypes.func,
    onModalClose: PropTypes.func,
    scope: PropTypes.string.isRequired,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    screenreaderNotification: PropTypes.func,
    liveRegion: OutcomePickerModal.propTypes.liveRegion,
    mountNode: OutcomePickerModal.propTypes.mountNode,
    styles: stylesShape,
  }

  static defaultProps = {
    pickerType: 'dialog',
    pickerProps: {},
    onUpdate: null,
    onModalOpen: null,
    onModalClose: null,
    readOnly: false,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
    screenreaderNotification: null,
    liveRegion: null,
    mountNode: null
  }

  handleModalOpen = () => {
    this.props.openOutcomePicker()
  }

  handleRemoveAlignment(outcome, index) {
    const { removeAlignment, alignedOutcomes, onUpdate } = this.props
    const priorListItem = this[`position${index - 1}`]
    removeAlignment(outcome.id, onUpdate)
    this.props.screenreaderNotification(
      t('{label} alignment removed', { label: outcome.label })
    )
    if (priorListItem) {
      priorListItem.focus()
    } else if (alignedOutcomes.length > 0) {
      // TBD - need to do something better here if first item is
      // removed, just doing this for now so there's consistent behavior
      const nextListItem = this[`position${index + 1}`]
      if (nextListItem) {
        nextListItem.focus()
      }
    }
  }

  triggerButton = () => {
    // eslint-disable-next-line react/no-find-dom-node
    const r = ReactDOM.findDOMNode(this.triggerRoot)
    return r.type === 'button' ? r : r.children[0]
  }

  componentDidUpdate(oldProps) {
    const { alignedOutcomes } = this.props
    if (oldProps.alignedOutcomes.length && !alignedOutcomes.length) {
      this.triggerButton().focus()
    }
  }

  renderAddOutcomeButton() {
    return (
      <li css={this.props.styles.addOutcome}>
        <IconButton
          elementRef={d => (this.triggerRoot = d)} // eslint-disable-line immutable/no-mutation
          shape='circle'
          color='primary'
          size="small"
          onClick={() => this.handleModalOpen()}
          screenReaderLabel=""
          css={this.props.styles.addOutcomeButton}
        >
          <IconPlusLine title={t('Align new outcomes')} />
        </IconButton>
      </li>
    )
  }

  renderList(filteredOutcomes) {
    const {
      viewAlignment,
      closeAlignment,
      isOpen,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText,
      readOnly,
      scope
    } = this.props
    return (
      <div>
        <ul css={this.props.styles.list}>
          {filteredOutcomes.map((outcome, index) => (
            <Alignment
              key={outcome.id}
              ref={(o) => {
                this[`position${index}`] = o
              }} // eslint-disable-line immutable/no-mutation
              removeAlignment={() => this.handleRemoveAlignment(outcome, index)}
              viewAlignment={() => viewAlignment(outcome.id)}
              closeAlignment={closeAlignment}
              outcome={outcome}
              isOpen={isOpen(outcome.id)}
              artifactTypeName={artifactTypeName}
              displayMasteryDescription={displayMasteryDescription}
              displayMasteryPercentText={displayMasteryPercentText}
              readOnly={readOnly}
              scope={scope}
              index={index}
            />
          ))}
          {!readOnly && this.renderAddOutcomeButton()}
        </ul>
      </div>
    )
  }

  renderEmpty() {
    return (
      !this.props.readOnly && (
        <Billboard
          elementRef={d => (this.triggerRoot = d)} // eslint-disable-line immutable/no-mutation
          heading={this.props.emptySetHeading}
          message={t('Browse and add outcomes by clicking here.')}
          headingAs="h3"
          headingLevel="h3"
          size="small"
          hero={<Clipboard />}
          type="button"
          onClick={this.handleModalOpen}
        />
      )
    )
  }

  renderBody() {
    const { alignedOutcomes } = this.props
    const filteredOutcomes = alignedOutcomes.filter((outcome) => outcome.decorator !== 'HIDE')
    if (filteredOutcomes && filteredOutcomes.length > 0) {
      return this.renderList(filteredOutcomes)
    } else {
      return this.renderEmpty()
    }
  }

  renderModal() {
    const {
      addModal: OutcomePickerModal,
      pickerProps,
      onUpdate,
      onModalOpen,
      onModalClose,
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
      <OutcomePickerModal
        onModalClose={onModalClose}
        onModalOpen={onModalOpen}
        onUpdate={onUpdate}
        trigger={this}
        scope={scope}
        launchContexts={launchContexts}
        artifactTypeName={artifactTypeName}
        displayMasteryDescription={displayMasteryDescription}
        displayMasteryPercentText={displayMasteryPercentText}
        screenreaderNotification={screenreaderNotification}
        liveRegion={liveRegion}
        mountNode={mountNode}
        {...pickerProps}
      />
    )
  }

  focus() {
    if (this.triggerRoot) {
      this.triggerButton().focus()
    }
  }

  render() {
    return (
      <div data-testid='alignment-list'>
        {this.renderBody()}
        {this.renderModal()}
      </div>
    )
  }
}

export default AlignmentList
