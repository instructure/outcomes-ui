import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { Checkbox } from '@instructure/ui-checkbox'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { IconArrowOpenDownLine, IconArrowOpenEndLine, IconTrashLine } from '@instructure/ui-icons'
import { IconButton } from '@instructure/ui-buttons'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { Popover } from '@instructure/ui-popover'
import { TruncateText } from '@instructure/ui-truncate-text'
import { View } from '@instructure/ui-view'
import OutcomeDescription from '../OutcomeDescription'
import { outcomeShape } from '../../store/shapes'
import useBoolean from '../../hooks/useBoolean'

const AlignmentItem = ({outcome, removeAlignment, canManageOutcomes, isTray, shouldFocus, isOutcomeSelected, selectOutcomeIds, deselectOutcomeIds}) => {
  const [truncated, setTruncated] = useState(true)
  const [titleTruncated, setTitleTruncated] = useState(false)
  const { id, label, title, description, friendly_description, scoring_method } = outcome
  const { algorithm, algorithm_data, mastery_percent, points_possible, scoring_tiers } = scoring_method
  const trashIconRef = useRef()
  const toggleExpandOutcomeDetails = () => setTruncated(prevState => !prevState)
  const [isShowingTooltip, showTooltip, hideTooltip] = useBoolean(false)

  useEffect(() => {
    if (shouldFocus) {
      trashIconRef.current?.focus()
    }
  }, [shouldFocus])

  const toggleOutcomeSelection = () => {
    if (isOutcomeSelected(id)) {
      deselectOutcomeIds([id])
    } else {
      selectOutcomeIds([id])
    }
  }

  const renderTitleText = (size, weight) => (
    <Text size={size} weight={weight} wrap='break-word'>
      {(!canManageOutcomes && label) ? label : title}
    </Text>
  )

  const handleUpdate = (isTruncated) => {
    if (titleTruncated !== isTruncated) {
      setTitleTruncated(isTruncated)
    }
  }

  const renderOutcomeTitle = () => (
    <div style={{padding: isTray ? '0.5rem 0' : '0.4rem 0 0 0.3rem'}} data-automation='alignmentItem__outcomeName'>
      {truncated ? (
        <React.Fragment>
          <TruncateText position='middle' onUpdate={handleUpdate}>
            {renderTitleText('medium', 'bold')}
            {/* The empty span solves an issue with the truncated text overflowing to the next line */}
            <span />
          </TruncateText>
        </React.Fragment>
      ) : renderTitleText('medium', 'bold')}
    </div>
  )

  const renderDeleteButton = () => (
    <div style={{padding: '0.2rem 0 0'}} data-automation='outcomeAlignmentItem__delete'>
      <IconButton
        size='small'
        withBackground={false}
        withBorder={false}
        screenReaderLabel={t('Remove {title}', {title})}
        onClick={removeAlignment}
        ref={trashIconRef}
      >
        <div style={{fontSize: '1rem'}}><IconTrashLine /></div>
      </IconButton>
    </div>
  )

  return (
    <View
      as='div'
      padding='x-small 0'
      data-automation='outcomeAlignment__item'
    >
      <Flex as='div' alignItems='start'>
        <Flex.Item as='div' size={isTray ? '4.5rem' : '2rem'}>
          <div style={{padding: '0.3125rem 0'}}>
            <Flex alignItems='center'>
              {isTray && (
                <Flex.Item as='div' padding='0 0 0 xx-small'>
                  <div className='OutcomeSelector'>
                    <Checkbox
                      label={
                        <ScreenReaderContent>
                          {t('Select outcome {title}', {title})}
                        </ScreenReaderContent>
                      }
                      value='medium'
                      checked={isOutcomeSelected(id)}
                      onChange={toggleOutcomeSelection}
                    />
                  </div>
                </Flex.Item>
              )}
              <Flex.Item as='div' data-automation='alignmentItem-expand-description'>
                <IconButton
                  size='small'
                  screenReaderLabel={
                    truncated
                      ? t('Expand description for outcome {title}', {title})
                      : t('Collapse description for outcome {title}', {title})
                  }
                  withBackground={false}
                  withBorder={false}
                  onClick={toggleExpandOutcomeDetails}
                >
                  <div style={{display: 'flex', alignSelf: 'center', fontSize: '0.875rem'}}>
                    {truncated ? (
                      <IconArrowOpenEndLine />
                    ) : (
                      <IconArrowOpenDownLine />
                    )}
                  </div>
                </IconButton>
              </Flex.Item>
            </Flex>
          </div>
        </Flex.Item>
        <Flex.Item alignItems='center' size='50%' shouldGrow>
          {truncated && titleTruncated ? (
            <Popover
              renderTrigger={renderOutcomeTitle()}
              isShowingContent={isShowingTooltip}
              onShowContent={showTooltip}
              onHideContent={hideTooltip}
              color='primary-inverse'
              placement='top start'
              offsetY={'-10rem'}
            >
              <View as='div' maxWidth='19rem' padding='small'>
                {renderTitleText('small', 'normal')}
              </View>
            </Popover>
          ) : renderOutcomeTitle()}
        </Flex.Item>
        {(canManageOutcomes && !isTray) && (
          <Flex.Item>
            {renderDeleteButton()}
          </Flex.Item>
        )}
      </Flex>
      <Flex as='div' alignItems='start'>
        <Flex.Item size={isTray ? '4.5rem' : '2.3rem'} />
        <Flex.Item size='80%'>
          <View as='div' padding='0 0 x-small'>
            <OutcomeDescription
              label={label}
              description={description}
              friendlyDescription={friendly_description}
              calculationMethod={algorithm}
              calculationInt={algorithm_data}
              masteryPercent={mastery_percent}
              pointsPossible={points_possible}
              ratings={scoring_tiers}
              truncated={truncated}
              isTray={isTray}
              canManageOutcomes={canManageOutcomes}
            />
          </View>
        </Flex.Item>
      </Flex>
    </View>
  )
}

AlignmentItem.propTypes = {
  outcome: outcomeShape.isRequired,
  removeAlignment: PropTypes.func,
  canManageOutcomes: PropTypes.bool,
  isTray: PropTypes.bool,
  shouldFocus: PropTypes.bool,
  isOutcomeSelected: PropTypes.func,
  selectOutcomeIds: PropTypes.func,
  deselectOutcomeIds: PropTypes.func
}

AlignmentItem.defaultProps = {
  removeAlignment: () => {},
  canManageOutcomes: true,
  isTray: false,
  shouldFocus: false,
  isOutcomeSelected: () => {},
  selectOutcomeIds: () => {},
  deselectOutcomeIds: () => {}
}

export default AlignmentItem
