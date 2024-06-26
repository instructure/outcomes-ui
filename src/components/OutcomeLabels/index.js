/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { IconOutcomesLine } from '@instructure/ui-icons'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import { stylesShape } from '../../store/shapes'


@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeLabels extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomes: PropTypes.array.isRequired,
    emptyText: PropTypes.string.isRequired,
    styles: stylesShape,
  }

  wrap = (str, includeComma) => {
    return (
      <span key={str}>
        <span css={this.props.styles.pill}>{str}</span>
        {includeComma && <span css={this.props.styles.pill}>,&nbsp;</span>}
      </span>
    )
  }

  render() {
    const { outcomes, emptyText } = this.props
    const filteredOutcomes = outcomes.filter((outcome) => outcome.decorator !== 'HIDE')
    return (
      <div
        css={this.props.styles.line}
        data-automation="outcomeLabel__alignedOutcomes"
        data-testid="prueba"
      >
        <Text size="medium">
          <IconOutcomesLine />
        </Text>
        <Text size="small">
          <div css={this.props.styles.text}>
            {filteredOutcomes.length === 0
              ? emptyText
              : filteredOutcomes.map((o, i) => {
                return this.wrap(o.title, i < filteredOutcomes.length - 1)
              })}
          </div>
        </Text>
      </div>
    )
  }
}
