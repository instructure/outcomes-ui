import React from 'react'
import PropTypes from 'prop-types'
import { AccessibleContent } from '@instructure/ui-a11y'
import t from 'format-message'

export default function AlignmentCount ({ count }) {
  if (count != null) {
    const title = t(`{
      count, plural,
            =0 {No outcomes are aligned}
          one {One outcome is aligned}
        other {# outcomes are aligned}
    }`, { count })

    return (
      <AccessibleContent alt={title}>
        <span title={title}>{
          t(`{
            count, plural,
                  =0 {(0)}
                one {(1)}
              other {(#)}
          }`, { count })
          // eslint-disable-next-line react/jsx-closing-tag-location
        }</span>
      </AccessibleContent>
    )
  }
  return <span />
}

AlignmentCount.propTypes = {
  count: PropTypes.number
}

AlignmentCount.defaultProps = {
  count: null
}
