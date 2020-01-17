import React from 'react'
import PropTypes from 'prop-types'

import { Pagination as InstuiPagination } from '@instructure/ui-pagination'

import t from 'format-message'

export default class Pagination extends React.Component {
  static propTypes = {
    numPages: PropTypes.number,
    page: PropTypes.number,
    updatePage: PropTypes.func.isRequired
  }

  static defaultProps = {
    numPages: 1,
    page: 1
  }

  renderPage (i) {
    const { page, updatePage } = this.props
    return (
      <InstuiPagination.Page key={i} current={i === page} onClick={() => updatePage(i)} data-automation='results__pageButton'>
        {t.number(i)}
      </InstuiPagination.Page>
    )
  }

  render() {
    const { numPages } = this.props
    return numPages > 1 && (
      <InstuiPagination margin="small" variant="compact" labelNext={t('Next Page')} labelPrev={t('Previous Page')}>
        { Array(numPages).fill(0).map((_value, i) => this.renderPage(i+1)) }
      </InstuiPagination>
    )
  }
}
