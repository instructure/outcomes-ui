import React from 'react'
import PropTypes from 'prop-types'
import { AccessibleContent } from '@instructure/ui-a11y'
import { Tag, Text } from '@instructure/ui-elements'
import { IconOutcomesLine } from '@instructure/ui-icons'
import themeable from '@instructure/ui-themeable'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeTags extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    ids: PropTypes.arrayOf(PropTypes.string).isRequired,
    emptyText: PropTypes.string.isRequired,
    getOutcome: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func,
  }

  static defaultProps = {
    deselectOutcomeIds: null,
  }

  componentDidUpdate (oldProps) {
    const { ids } = this.props
    if (oldProps.ids.length && !ids.length) {
      this.emptyResults.focus()
    }
  }

  inputRefs = []

  setRef = (id, ref) => {
    this.inputRefs[id] = ref
  };

  focusInput = (id) => this.inputRefs[id].focus()

  getSortedOutcomes () {
    const { ids, getOutcome } = this.props
    return ids.map((id) => {
      const o = getOutcome(id)
      return o
    }).sort((a, b) => {
      return a.title ? a.title.localeCompare(b.title) : -1
    })
  }

  renderEmpty () {
    const { emptyText } = this.props
    return  (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      <div className={styles.text} ref={(ref) => this.emptyResults = ref} tabIndex="-1">
        { emptyText }
      </div>
    )
  }

  renderTags () {
    const { deselectOutcomeIds } = this.props
    const sortedOutcomes = this.getSortedOutcomes()

    return sortedOutcomes.map((o, index) => {
      return (
        <div className={styles.text} key={o.id}>
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

  render () {
    return (
      <div className={styles.line} data-automation='outcomeTag__alignedOutcomes'>
        <Text size="medium">
          <IconOutcomesLine />
        </Text>
        <div className={styles.tags}>
          { this.props.ids.length ? this.renderTags() : this.renderEmpty() }
        </div>
      </div>
    )
  }
}
