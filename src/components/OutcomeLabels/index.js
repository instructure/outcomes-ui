import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-elements'
import { IconOutcomesLine } from '@instructure/ui-icons'
import themeable from '@instructure/ui-themeable'

import theme from '../theme'
import styles from './styles.css'

const wrap = (str, includeComma) => {
  return (
    <span>
      <span className={styles.pill}>
        {str}
      </span>
      {
        includeComma && <span className={styles.comma}>,</span>
      }
    </span>
  )
}

@themeable(theme, styles)
export default class OutcomeLabels extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    ids: PropTypes.arrayOf(PropTypes.string).isRequired,
    getOutcome: PropTypes.func.isRequired,
    emptyText: PropTypes.string.isRequired
  }

  render () {
    const { ids, emptyText, getOutcome } = this.props
    return (
      <div className={styles.line} data-automation='outcomeLabel__alignedOutcomes'>
        <Text size="medium">
          <IconOutcomesLine />
        </Text>
        <Text size="small">
          <div className={styles.text}>
            {
              ids.length === 0 ? emptyText : ids.map((id) => {
                const o = getOutcome(id)
                return o.title
              }).sort((a, b) => {
                return a ? a.localeCompare(b) : -1
              }).map((s, i) => {
                return wrap(s, i < ids.length - 1)
              })
            }
          </div>
        </Text>
      </div>
    )
  }
}
