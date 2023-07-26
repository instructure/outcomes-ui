import React from 'react'
import t from 'format-message'
import PropTypes from 'prop-types'
import { Spinner } from '@instructure/ui-spinner'
import { Flex } from '@instructure/ui-flex'
import AlignmentItem from '../../AlignmentItem'
import Pagination from '../../Pagination'

export const RESULTS_PER_PAGE = 10

export default class OutcomeList extends React.Component {
  static propTypes = {
    outcomes: PropTypes.array.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    getOutcomesList: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    listPage: PropTypes.number.isRequired,
    listTotal: PropTypes.number,
    features: PropTypes.array
  }

  static defaultProps = {
    listTotal: null,
    features: []
  }

  renderList () {
    const {
      outcomes,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds,
      features
    } = this.props
    return outcomes.map(outcome => {
      return (
        <div key={outcome.id}>
          <AlignmentItem
            outcome={outcome}
            isOutcomeSelected={isOutcomeSelected}
            selectOutcomeIds={selectOutcomeIds}
            deselectOutcomeIds={deselectOutcomeIds}
            isTray={true}
            features={features}
          />
        </div>
      )
    })
  }

  renderLoading () {
    return (
      <Flex justifyItems="center">
        <Flex.Item padding="small">
          <Spinner renderTitle={t('Loading')} />
        </Flex.Item>
      </Flex>
    )
  }

  renderPagination () {
    const { listPage, listTotal, getOutcomesList } = this.props
    return (
      <Pagination
        page={listPage}
        updatePage={(page) => getOutcomesList({ page })}
        numPages={Math.ceil(listTotal / RESULTS_PER_PAGE)}
      />
    )
  }

  render () {
    const { isLoading } = this.props
    return (
      <Flex
        height="100%" width="100%"
        padding="none none none none" alignItems="stretch" direction="column">
        <Flex.Item shouldGrow>
          {isLoading ? this.renderLoading() : this.renderList()}
        </Flex.Item>
        <Flex.Item>
          {!isLoading && this.renderPagination()}
        </Flex.Item>
      </Flex>
    )
  }
}
