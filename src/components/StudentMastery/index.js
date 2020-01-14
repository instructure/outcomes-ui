import React from 'react'
import PropTypes from 'prop-types'
import t, { number } from 'format-message'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { Table, Text } from '@instructure/ui-elements'
import { Spinner } from '@instructure/ui-spinner'
import themeable from '@instructure/ui-themeable'
import { individualResultShape } from '../../store/shapes'
import { sanitizeHtml } from '../../lib/sanitize'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class StudentMastery extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    artifactType: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    artifactId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    userUuid: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    mastery: PropTypes.bool.isRequired,
    masteryText: PropTypes.string,
    loadIndividualResults: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    results: PropTypes.arrayOf(individualResultShape),
    displayOutcomeLabel: PropTypes.bool,
    state: PropTypes.string.isRequired
  }

  static defaultProps = {
    masteryText: null,
    results: [],
    displayOutcomeLabel: false
  }

  componentWillMount () {
    this.loadIfNeeded(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.loadIfNeeded(nextProps)
  }

  loadIfNeeded (props) {
    const {
      artifactType,
      artifactId,
      userUuid,
      loadIndividualResults,
      state
    } = props
    if (state !== 'loading' && state !== 'loaded') {
      loadIndividualResults(artifactType, artifactId, userUuid)
    }
  }

  description () {
    if (this.props.masteryText) {
      return this.props.masteryText
    }
    if (this.props.mastery) {
      return t("Learning Outcomes You've Mastered")
    } else {
      return t('Opportunities for Learning and Growth')
    }
  }

  outcomeTitle (outcome) {
    const { displayOutcomeLabel } = this.props
    if (displayOutcomeLabel) {
      return outcome.label ? outcome.label : outcome.title
    }
    return outcome.title
  }

  renderLoading () {
    const { state } = this.props
    if (state !== 'loading') return null
    return (
      <div className={styles.loadingRow}>
        <Spinner renderTitle={t('Loading')} />
      </div>
    )
  }

  renderRow = ({ outcome, outcome_rollup: outcomeRollup, percent_score: percentScore }) => {
    const institutionScore = outcomeRollup.average_score
    const difference = institutionScore === 0 ? 0 : (percentScore - institutionScore) / institutionScore

    return (
      <tr key={outcome.id}>
        <th scope="row" className={styles.masteryOutcomeTitle} data-automation="studentMastery__masteryOutcomeTitle">
          <Text>
            { this.outcomeTitle(outcome) }
          </Text>
        </th>
        <td className={styles.masteryOutcomeDescriptionContainer}>
          <Text>
            <div
              className={styles.masteryOutcomeDescription}
              dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                __html: sanitizeHtml(outcome.description)
              }}
            />
          </Text>
        </td>
        <td className={styles.masteryOutcomeScore} data-automation="studentMastery__individualOutcomeScore">
          <Text size="large" weight="bold">
            {number(percentScore, 'percent')}
          </Text>
        </td>
        <td className={styles.masteryOutcomeScore} data-automation="studentMastery__institutionOutcomeScore">
          <Text size="large" weight="bold">
            {number(institutionScore, 'percent')}
          </Text>
        </td>
        <td className={styles.masteryOutcomeScore} data-automation="studentMastery__differenceOutcomeScore">
          <Text size="large" weight="bold">
            {number(difference, 'percent')}
          </Text>
        </td>
      </tr>
    )
  }

  filterResults (results, mastery) {
    return results.filter(
      (result) => result.outcome && result.outcome.scoring_method &&
        (result.percent_score >= result.outcome.scoring_method.mastery_percent) === mastery
    )
  }

  renderEmptyRow (text) {
    return (
      <div className={styles.emptyRow}>
        <Text>
          { text }
        </Text>
      </div>
    )
  }

  noMasteryText () {
    return t('You have not mastered any outcomes yet.')
  }

  noOpportunityText () {
    return t('There are no opportunities available.')
  }

  renderEmpty (results, filteredResults) {
    const { mastery, state } = this.props
    if (state !== 'loaded') return null
    if (results.length === 0) {
      return this.renderEmptyRow(this.noOpportunityText())
    } else if (filteredResults.length === 0) {
      return this.renderEmptyRow(mastery ? this.noMasteryText() : this.noOpportunityText())
    }
  }

  renderTable (rows) {
    return (
      <Table caption={<ScreenReaderContent>{this.description()}</ScreenReaderContent>}>
        <tbody>
          <tr>
            <th colSpan="2" className={styles.masteryCaptionHeader}>
              {this.description()}
            </th>
            <th scope="col" className={styles.masteryScoreHeader}>{t('Student\'s Score')}</th>
            <th scope="col" className={styles.masteryScoreHeader}>{t('Institution Average')}</th>
            <th scope="col" className={styles.masteryDiffHeader}>{t('Difference')}</th>
          </tr>
          <tr>
            <th scope="col" className={styles.masteryHiddenHeader}>
              <ScreenReaderContent>{t('Title')}</ScreenReaderContent>
            </th>
            <th scope="col" className={styles.masteryHiddenHeader}>
              <ScreenReaderContent>{t('Description')}</ScreenReaderContent>
            </th>
          </tr>
          {rows.map(this.renderRow)}
        </tbody>
      </Table>
    )
  }

  render () {
    const { mastery, results, state } = this.props
    const filteredResults = state === 'loaded' ? this.filterResults(results, mastery) : []

    return (
      <div>
        { this.renderTable(filteredResults) }
        { this.renderLoading() }
        { this.renderEmpty(results, filteredResults) }
      </div>
    )
  }
}
