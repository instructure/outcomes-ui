/** @jsx jsx */
import t from 'format-message'
import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-text'
import { Link } from '@instructure/ui-link'
import {
  IconTrashLine,
  IconOutcomesLine,
  IconSubaccountsLine,
  IconCoursesLine,
  IconWarningLine
} from '@instructure/ui-icons'
import { View } from '@instructure/ui-view'
import { withStyle, jsx } from '@instructure/emotion'
import OutcomeViewModal from '../OutcomeViewModal'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import { stylesShape } from '../../store/shapes'
import {Pill} from '@instructure/ui-pill'
import {Tooltip} from '@instructure/ui-tooltip'

@withStyle(generateStyle, generateComponentTheme)
export default class Alignment extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcome: PropTypes.shape({
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      in_launch_context: PropTypes.bool,
      launch_context_type: PropTypes.string,
      source_context_info: PropTypes.shape({
        name: PropTypes.string,
        context_type: PropTypes.string,
        uuid: PropTypes.string
      })
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

  getIcon(decorator, color) {
    if (color === 'danger') {
      return IconWarningLine
    }
    return decorator?.includes('ACCOUNT') ? IconSubaccountsLine : IconCoursesLine
  }

  getPillText(decorator, color) {
    if (color === 'danger') {
      return decorator?.includes('ACCOUNT') ? t('Not in this Sub-Account') : t('Not in this Course')
    }
    return decorator?.includes('ACCOUNT') ? t('Sub-Account Outcome') : t('Course Outcome')
  }

  renderWithTooltip = (Icon, color, text) => {
    return (
      <span css={this.props.styles.rightAligned}>
        <Tooltip renderTip={t('To add this outcome, navigate to the Outcomes Management page.')}>
          <Pill
            renderIcon={<Icon/>}
            color={color}
            margin="xxx-small"
          >
            {text}
          </Pill>
        </Tooltip>
      </span>
    )
  }

  renderWithoutTooltip = (Icon, color, text) => {
    return (
      <span css={this.props.styles.rightAligned}>
        <Pill
          renderIcon={<Icon/>}
          color={color}
          margin="xxx-small"
        >
          {text}
        </Pill>
      </span>
    )
  }

  renderOutcomeDecoration(index, outcome) {
    const decorator = outcome.decorator
    const display = ['SUB_ACCOUNT_OUTCOME', 'NOT_IN_SUB_ACCOUNT', 'COURSE_OUTCOME', 'NOT_IN_COURSE'].includes(decorator)
    const color = decorator?.startsWith('NOT_IN') ? 'danger' : 'primary'
    const Icon = this.getIcon(decorator, color)
    const text = this.getPillText(decorator, color)
    const renderFunction = color === 'danger' ? this.renderWithTooltip : this.renderWithoutTooltip
    return display && renderFunction(Icon, color, text)
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
    return outcome.decorator !== 'HIDE' && (
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
                {outcome.source_context_info && <Text
                  as="div"
                  weight="light"
                  size="x-small"
                  lineHeight="condensed"
                >
                  {outcome.source_context_info.name}
                </Text>}
              </View>
            </span>
          </span>
        </span>
        {this.renderOutcomeDecoration(index, outcome)}
        {!readOnly && (
          <span css={this.props.styles.rightAligned} data-automation="alignment-delete">
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
