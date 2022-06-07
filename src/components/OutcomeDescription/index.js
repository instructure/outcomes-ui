import React from 'react'
import PropTypes from 'prop-types'
import Ratings from '../Ratings'
import t from 'format-message'
import { algorithmDataShape, scoringTierShape } from '../../store/shapes'
import {
  HIGHEST,
  LATEST,
  N_MASTERY,
  DECAYING_AVERAGE,
  AVERAGE,
  CALCULATION_METHODS
} from '../../constants'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { TruncateText } from '@instructure/ui-truncate-text'
import { View } from '@instructure/ui-view'

const OutcomeDescription = ({
  label,
  description,
  friendlyDescription,
  shouldTruncateText,
  maxLines,
  calculationMethod,
  calculationInt,
  masteryPercent,
  pointsPossible,
  ratings,
  truncated,
  isTray,
  canManageOutcomes
}) => {

  const descriptionDisplay = (!canManageOutcomes && friendlyDescription) ? friendlyDescription : description

  const stripHtmlTags = (text) => {
    const doc = new DOMParser().parseFromString(text, 'text/html')
    return doc.body.textContent || ''
  }

  const truncateText = (text, position) => (
    <TruncateText maxLines={maxLines} position={position}>
      {text}
    </TruncateText>
  )

  const renderText = (text, position) => {
    const strippedText = stripHtmlTags(text)
    const renderedText = (truncated && shouldTruncateText) ? truncateText(strippedText, position) : strippedText
    return (
      <Text>
        {renderedText}
      </Text>
    )
  }

  const formatCalculationMethodText = () => {
    let method = ''
    switch (calculationMethod) {
      case HIGHEST: {
        method = t(CALCULATION_METHODS[HIGHEST])
        break
      }
      case LATEST: {
        method = t(CALCULATION_METHODS[LATEST])
        break
      }
      case N_MASTERY: {
        const n = calculationInt.n_mastery_count
        method = t(CALCULATION_METHODS[N_MASTERY], {n})
        break
      }
      case AVERAGE: {
        method = t(CALCULATION_METHODS[AVERAGE])
        break
      }
      case DECAYING_AVERAGE: {
        const percent = calculationInt.decaying_average_percent
        const complement = 100 - percent
        method = t(CALCULATION_METHODS[DECAYING_AVERAGE], {percent, complement})
      }
    }
    return method
  }

  const renderFriendlyDescription = () => (
    friendlyDescription &&
      <>
        <View
          as='div'
          margin='x-small small 0 0'
          padding='small small x-small small'
          background='secondary'
          data-automation='outcomeDescription__friendly_description_header'
        >
          <Text weight='bold'>{t('Friendly Description')}</Text>
        </View>
        <View
          as='div'
          margin='0 small x-small 0'
          padding='0 small small small'
          background='secondary'
          data-automation='outcomeDescription__friendly_description_expanded'
        >
          <Text wrap='break-word'>{friendlyDescription}</Text>
        </View>
      </>
  )

  const renderRatingsAndCalculation = () => (
    <View>
      {ratings.length > 0 && (
        <View as='div' margin='small none'>
          <Ratings
            ratings={ratings}
            masteryPercent={masteryPercent}
            pointsPossible={pointsPossible}
            isTray={isTray}
          />
        </View>
      )}
      {(calculationMethod && calculationInt) && (
        <Flex
          wrap='wrap'
          padding='none small small none'
        >
          <Flex.Item
            as='div'
            padding='none xx-small none none'
          >
            <View as='div'>
              <Text weight='bold'>{t('Proficiency Calculation:')}</Text>
            </View>
          </Flex.Item>
          <Flex.Item>
            <Text color='primary' weight='normal'>
              {formatCalculationMethodText()}
            </Text>
          </Flex.Item>
        </Flex>
      )}
    </View>
  )

  return (
    <>
      {(label && canManageOutcomes) && (
        <View as='div' margin='0 0 xx-small'>
          {renderText(label, 'middle')}
        </View>
      )}
      {(!truncated && canManageOutcomes) && renderFriendlyDescription()}
      {description && (
        <View as='div' margin={canManageOutcomes ? 'xx-small 0' : '0'} data-automation='outcomeDescription__description'>
          {renderText(descriptionDisplay, 'end')}
        </View>
      )}
      {!truncated && renderRatingsAndCalculation()}
    </>
  )
}

OutcomeDescription.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  friendlyDescription: PropTypes.string,
  shouldTruncateText: PropTypes.bool,
  maxLines: PropTypes.number,
  calculationMethod: PropTypes.string,
  calculationInt: algorithmDataShape,
  masteryPercent: PropTypes.number,
  pointsPossible: PropTypes.number,
  ratings: PropTypes.arrayOf(scoringTierShape),
  truncated: PropTypes.bool,
  isTray: PropTypes.bool,
  canManageOutcomes: PropTypes.bool
}

OutcomeDescription.defaultProps = {
  label: '',
  description: '',
  friendlyDescription: '',
  shouldTruncateText: true,
  maxLines: 1,
  isTray: false,
  calculationMethod: '',
  calculationInt: null,
  masteryPercent: null,
  pointsPossible: null,
  ratings: [],
  truncated: true,
  canManageOutcomes: true
}

export default OutcomeDescription