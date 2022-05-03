import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { TruncateText } from '@instructure/ui-truncate-text'

const OutcomeDescription = ({label, description, truncate, maxLines}) => {

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
    const renderedText = truncate ? truncateText(strippedText, position) : strippedText
    return (
      <Text>
        {renderedText}
      </Text>
    )
  }

  return (
    <React.Fragment>
      {label && renderText(label, 'middle')}
      {description && renderText(description, 'end')}
    </React.Fragment>
  )
}

OutcomeDescription.propTypes = {
  description: PropTypes.string,
  label: PropTypes.string,
  truncate: PropTypes.bool,
  maxLines: PropTypes.number
}

OutcomeDescription.defaultProps = {
  description: '',
  label: '',
  truncate: true,
  maxLines: 1
}

export default OutcomeDescription