/** @jsx jsx */
import React from 'react'
import t from 'format-message'
import PropTypes from 'prop-types'

import { Button, CloseButton } from '@instructure/ui-buttons'
import { Heading } from '@instructure/ui-heading'
import { Flex } from '@instructure/ui-flex'
import { Modal } from '@instructure/ui-modal'
import { View } from '@instructure/ui-view'
import { Tray } from '@instructure/ui-tray'
import { Spinner } from '@instructure/ui-spinner'
import { withStyle, jsx } from '@instructure/emotion'
import OutcomeList from './OutcomeList'
import SearchInput from '../SearchInput'
import SearchResults from '../SearchResults'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import { outcomeShape, stylesShape } from '../../store/shapes'

const { Footer: ModalFooter } = Modal

@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeTray extends React.Component {
  static propTypes = {
    searchText: PropTypes.string.isRequired,
    updateSearchText: PropTypes.func.isRequired,
    setSearchLoading: PropTypes.func.isRequired,
    setSearchEntries: PropTypes.func.isRequired,
    isSearchLoading: PropTypes.bool.isRequired,
    searchEntries: PropTypes.array.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    saveOutcomePickerAlignments: PropTypes.func.isRequired,
    screenreaderNotification: PropTypes.func,
    liveRegion: Tray.propTypes.liveRegion,
    mountNode: Tray.propTypes.mountNode,
    size: PropTypes.string,
    placement: PropTypes.string,
    searchTotal: PropTypes.number,
    searchPage: PropTypes.number.isRequired,
    outcomes: PropTypes.array.isRequired,
    getOutcomesList: PropTypes.func.isRequired,
    updateSearchPage: PropTypes.func.isRequired,
    listPage: PropTypes.number.isRequired,
    listTotal: PropTypes.number,
    isFetching: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeOutcomePicker: PropTypes.func.isRequired,
    resetOutcomePicker: PropTypes.func.isRequired,
    setInitialSelectedOutcomes: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    focusedOutcome: outcomeShape,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    shouldModifyArtifact: PropTypes.bool,
    scope: PropTypes.string.isRequired,
    showAlert: PropTypes.func,
    features: PropTypes.array,
    styles: stylesShape,
  }

  static defaultProps = {
    screenreaderNotification: null,
    liveRegion: null,
    mountNode: null,
    size: 'regular',
    placement: 'end',
    onUpdate: null,
    focusedOutcome: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
    shouldModifyArtifact: false,
    searchTotal: null,
    listTotal: null,
    showAlert: () => {},
    features: []
  }

  componentDidUpdate(prevProps) {
    const {
      getOutcomesList,
      isOpen,
      updateSearchText,
      setInitialSelectedOutcomes
    } = this.props

    if (!prevProps.isOpen && isOpen) {
      getOutcomesList({ page: 1 })
      updateSearchText('')
      setInitialSelectedOutcomes()
    }
  }

  renderList() {
    const {
      outcomes,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds,
      isFetching,
      listPage,
      listTotal,
      getOutcomesList,
      features
    } = this.props

    return (
      <View display="block" padding="small none none none">
        <OutcomeList
          outcomes={outcomes}
          isOutcomeSelected={isOutcomeSelected}
          selectOutcomeIds={selectOutcomeIds}
          deselectOutcomeIds={deselectOutcomeIds}
          isLoading={isFetching}
          listPage={listPage}
          listTotal={listTotal}
          getOutcomesList={getOutcomesList}
          features={features}
        />
      </View>
    )
  }

  renderSearchMode() {
    const {
      screenreaderNotification,
      setSearchLoading,
      setSearchEntries,
      searchText,
      updateSearchPage,
      isSearchLoading,
      isOutcomeSelected,
      searchEntries,
      searchPage,
      searchTotal,
      selectOutcomeIds,
      deselectOutcomeIds
    } = this.props

    return (
      <SearchResults
        screenreaderNotification={screenreaderNotification}
        setSearchLoading={setSearchLoading}
        setSearchEntries={setSearchEntries}
        searchText={searchText}
        updateSearchPage={updateSearchPage}
        isSearchLoading={isSearchLoading}
        isOutcomeSelected={isOutcomeSelected}
        searchEntries={searchEntries}
        searchPage={searchPage}
        searchTotal={searchTotal}
        selectOutcomeIds={selectOutcomeIds}
        deselectOutcomeIds={deselectOutcomeIds}
      />
    )
  }

  renderBody() {
    const { searchText, isFetching } = this.props
    if (isFetching) {
      return (
        <Flex justifyItems="center">
          <Flex.Item padding="small">
            <Spinner renderTitle={t('Loading')} />
          </Flex.Item>
        </Flex>
      )
    }
    return searchText ? this.renderSearchMode() : this.renderList()
  }

  handleSubmit() {
    const {
      saveOutcomePickerAlignments,
      onUpdate,
      closeOutcomePicker,
      shouldModifyArtifact
    } = this.props
    return saveOutcomePickerAlignments(onUpdate, shouldModifyArtifact).then(
      () => {
        this.props.showAlert(
          t('Outcome alignments have been successfully updated.')
        )
        closeOutcomePicker()
      }
    )
  }

  renderActions() {
    const { closeOutcomePicker } = this.props

    return (
      <div css={this.props.styles.footerContainer}>
        <ModalFooter>
          <Button margin="xxx-small" onClick={closeOutcomePicker}>
            {t('Cancel')}
          </Button>
          <Button
            margin="xxx-small"
            color="primary"
            onClick={() => this.handleSubmit()}
          >
            {t('Confirm Alignments')}
          </Button>
        </ModalFooter>
      </div>
    )
  }

  render() {
    const {
      liveRegion,
      mountNode,
      searchText,
      placement,
      size,
      updateSearchText,
      closeOutcomePicker,
      isOpen,
      resetOutcomePicker
    } = this.props

    const trayProps = { placement, size }
    return (
      <Tray
        data-automation="outcomeTrayPicker__view"
        liveRegion={liveRegion}
        mountNode={mountNode}
        open={isOpen}
        onExiting={resetOutcomePicker}
        label={t('Align Outcomes')}
        {...trayProps}
      >
        <div css={this.props.styles.outcomeTray}>
          <div css={this.props.styles.trayContainer}>
            <Flex margin="none none small none">
              <Flex.Item shouldGrow shouldShrink>
                <Heading level="h3" margin="0 0 x-small">
                  {t('Align Outcomes')}
                </Heading>
              </Flex.Item>
              <Flex.Item>
                <CloseButton
                  onClick={closeOutcomePicker}
                  screenReaderLabel={t('Cancel')}
                />
              </Flex.Item>
            </Flex>
            <SearchInput
              onChange={(_, value) => updateSearchText(value)}
              onClear={() => updateSearchText('')}
              searchText={searchText}
            />
            {this.renderBody()}
          </div>
          {this.renderActions()}
        </div>
      </Tray>
    )
  }
}
