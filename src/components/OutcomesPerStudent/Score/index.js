import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-elements'
import { IconStarSolid } from '@instructure/ui-icons'
import t from 'format-message'
import classNames from 'classnames'
import { themeable } from '@instructure/ui-themeable'

import theme from '../../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class Score extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    score: PropTypes.object,
    outcome: PropTypes.object.isRequired
  }

  static defaultProps = {
    score: null
  }

  render () {
    const { score, outcome } = this.props
    const mastery = score && score.percentScore >= outcome.scoring_method.mastery_percent

    const outerStyle = classNames({
      [styles.score]: true,
      [styles.mastery]: mastery
    })
    return score && (
      <div className={outerStyle}>
        <span className={styles.masteryStar}>
          {
            mastery && (
              <IconStarSolid data-automation='outcomesPerStudent__masteryStar'/>
            )
            // eslint-disable-next-line react/jsx-closing-tag-location
          }</span>
        <div className={styles.scoreText}>
          <Text size="small" data-automation="outcomesPerStudent__scoreText">{score.points}/{score.pointsPossible}</Text>
          <Text size="small">{mastery ? t('Mastery') : t("Didn't Meet")}</Text>
        </div>
        <span className={styles.scoreSpacer} />
      </div>
    )
  }
}
