import React from 'react'
import t from 'format-message'
import NoResultsIcon from '../../icons/no-results-panda.svg'
import {Billboard} from '@instructure/ui-billboard'

const NoResults = () => {
  return (
    <Billboard
      message={t('To add or create outcomes, visit the Canvas outcomes page or contact your admin.')}
      heading={t('There are no outcomes')}
      headingAs="h3"
      headingLevel="h3"
      size="small"
      hero={<NoResultsIcon/>}
      margin="medium"
    />
  )
}

export default NoResults
