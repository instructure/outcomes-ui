import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { IconOutcomesLine } from '@instructure/ui-icons'
import { themeable } from '@instructure/ui-themeable'

import theme from '../theme'
import styles from './styles.css'

const wrap = (str, includeComma) => {
  return (
    <span>
      <span className={styles.pill}>{str}</span>
      {includeComma && <span className={styles.comma}>,</span>}
    </span>
  )
}

@themeable(theme, styles)
export default class OutcomeLabels extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomes: PropTypes.array.isRequired,
    emptyText: PropTypes.string.isRequired
  }

  render() {
    const { outcomes, emptyText } = this.props
    return (
      <div
        className={styles.line}
        data-automation="outcomeLabel__alignedOutcomes"
      >
        <Text size="medium">
          <IconOutcomesLine />
        </Text>
        <Text size="small">
          <div className={styles.text}>
            {outcomes.length === 0
              ? emptyText
              : outcomes.map((o, i) => {
                return wrap(o.title, i < outcomes.length - 1)
              })}
          </div>
        </Text>
      </div>
    )
  }
}
