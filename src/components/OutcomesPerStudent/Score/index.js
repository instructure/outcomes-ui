/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { IconStarSolid } from '@instructure/ui-icons'
import t from 'format-message'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../../theme'
import generateStyle from './styles'
import { hasMastery } from '../../../util/outcomesReportUtils'

@withStyle(generateStyle, generateComponentTheme)
export default class Score extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    score: PropTypes.object,
    outcome: PropTypes.object.isRequired,
    // eslint-disable-next-line react/require-default-props
    styles: PropTypes.object,
  }

  static defaultProps = {
    score: null
  }

  render() {
    const { score, outcome } = this.props
    const mastery = hasMastery(score, outcome)

    const outerStyle = {
      ...this.props.styles.score,
      ...(mastery ? this.props.styles.mastery : {}),
    }
    return (
      score && (
        <div css={outerStyle} data-automation="outcomesPerStudent__score">
          <span css={this.props.styles.masteryStar}>
            {
              mastery && (
                <IconStarSolid data-automation="outcomesPerStudent__masteryStar" />
              )
              // eslint-disable-next-line react/jsx-closing-tag-location
            }
          </span>
          <div css={this.props.styles.scoreText}>
            <Text size="small" data-automation="outcomesPerStudent__scoreText">
              {score.points}/{score.pointsPossible}
            </Text>
            <Text size="small">
              {mastery ? t('Mastery') : t("Didn't Meet")}
            </Text>
          </div>
          <span css={this.props.styles.scoreSpacer} />
        </div>
      )
    )
  }
}
