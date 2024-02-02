/** @jsx jsx */
import t from 'format-message'
import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-text'
import { Link } from '@instructure/ui-link'
import { IconTrashLine, IconOutcomesLine } from '@instructure/ui-icons'
import { View } from '@instructure/ui-view'
import { withStyle, jsx } from '@instructure/emotion'
import OutcomeViewModal from '../OutcomeViewModal'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import { stylesShape } from '../../store/shapes'

@withStyle(generateStyle, generateComponentTheme)
export default class Alignment extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcome: PropTypes.shape({
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      source_context_name: PropTypes.string
    }).isRequired,
    removeAlignment: PropTypes.func.isRequired,
    viewAlignment: PropTypes.func.isRequired,
    closeAlignment: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    scope: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    styles: stylesShape,
  }

  static defaultProps = {
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false
  }

  focus() {
    this.focusLink.focus()
  }

  render() {
    const {
      index,
      outcome,
      removeAlignment,
      viewAlignment,
      closeAlignment,
      isOpen,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText,
      readOnly,
      scope
    } = this.props
    const removeMessage = t(
      {
        default: 'Remove {title}',
        description:
          'Screen reader caption for button that removes an alignment'
      },
      {
        title: outcome.title
      }
    )
    let itemStyle = [this.props.styles.item]
    if (index !== 0){
      itemStyle.push(this.props.styles.itemSeparator)
    }
    return (
      <li css={itemStyle} data-automation="outcomeAlignment__item">
        <span css={this.props.styles.outcome}>
          <Text size="large">
            <IconOutcomesLine />
          </Text>
        </span>
        <span css={this.props.styles.link}>
          <span css={this.props.styles.linkText}>
            <span css={this.props.innerLinkText}>
              <View as="div" margin="none none none xx-small">
                <Link
                  onClick={viewAlignment}
                  ref={(link) => {
                    this.focusLink = link
                  }} // eslint-disable-line immutable/no-mutation
                >
                  <Text weight="bold" lineHeight="condensed">{outcome.title}</Text>
                </Link>
                {outcome.source_context_name && <Text
                  as="div"
                  weight="light"
                  size="x-small"
                  lineHeight="condensed"
                >
                  {outcome.source_context_name}
                </Text>}
              </View>
            </span>
          </span>
        </span>
        {!readOnly && (
          <span css={this.props.styles.delete} data-automation="alignment-delete">
            <IconButton
              screenReaderLabel=""
              onClick={removeAlignment}
              withBorder={false}
              withBackground={false}
            >
              <IconTrashLine title={removeMessage} />
            </IconButton>
          </span>
        )}
        <OutcomeViewModal
          outcome={outcome}
          closeAlignment={closeAlignment}
          isOpen={isOpen}
          artifactTypeName={artifactTypeName}
          displayMasteryDescription={displayMasteryDescription}
          displayMasteryPercentText={displayMasteryPercentText}
          scope={scope}
        />
      </li>
    )
  }
}
