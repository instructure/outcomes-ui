/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { AccessibleContent } from '@instructure/ui-a11y-content'
import { Text } from '@instructure/ui-text'
import { Tag } from '@instructure/ui-tag'
import { IconOutcomesLine } from '@instructure/ui-icons'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import { stylesShape } from '../../store/shapes'

@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeTags extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    emptyText: PropTypes.string.isRequired,
    outcomes: PropTypes.array.isRequired,
    deselectOutcomeIds: PropTypes.func,
    styles: stylesShape,
  }

  static defaultProps = {
    deselectOutcomeIds: null
  }

  componentDidUpdate(oldProps) {
    const { outcomes } = this.props
    if (oldProps.outcomes.length && !outcomes.length) {
      this.emptyResults.focus()
    }
  }

  inputRefs = []

  setRef = (id, ref) => {
    this.inputRefs[id] = ref
  }

  focusInput = (id) => this.inputRefs[id].focus()

  getSortedOutcomes() {
    const { outcomes } = this.props
    return outcomes.sort((a, b) => {
      return a.title ? a.title.localeCompare(b.title) : -1
    }).filter((outcome) => outcome.decorator !== 'HIDE')
  }

  renderEmpty() {
    const { emptyText } = this.props
    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      <div
        css={this.props.styles.text}
        ref={(ref) => (this.emptyResults = ref)}
        tabIndex="-1"
      >
        {emptyText}
      </div>
    )
  }

  renderTags() {
    const { deselectOutcomeIds } = this.props
    const sortedOutcomes = this.getSortedOutcomes()

    return sortedOutcomes.map((o, index) => {
      return (
        <div css={this.props.styles.text} key={o.id}>
          <Tag
            key={o.id}
            elementRef={(ref) => this.setRef(o.id, ref)}
            text={
              <AccessibleContent alt={`Remove ${o.title}`}>
                {o.title}
              </AccessibleContent>
            }
            data-automation="outcomeTag__text"
            onClick={() => {
              deselectOutcomeIds && deselectOutcomeIds([o.id])
              const priorListItem = sortedOutcomes[index - 1]
              if (priorListItem) {
                this.focusInput(priorListItem.id)
              } else {
                const nextListItem = sortedOutcomes[index + 1]
                if (nextListItem) {
                  this.focusInput(nextListItem.id)
                }
              }
            }}
            dismissible
          />
        </div>
      )
    })
  }

  render() {
    const sortedOutcomes = this.getSortedOutcomes()
    return (
      <div
        css={this.props.styles.line}
        data-automation="outcomeTag__alignedOutcomes"
      >
        <Text size="medium">
          <IconOutcomesLine />
        </Text>
        <div css={this.props.styles.tags}>
          {sortedOutcomes.length ? this.renderTags() : this.renderEmpty()}
        </div>
      </div>
    )
  }
}
