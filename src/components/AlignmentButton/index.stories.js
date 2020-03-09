import React from 'react'
import AlignmentButton from './'

export default {
  title: 'AlignmentButton'
}

const defaultProps = {
  openOutcomePicker: () => {},
  tray: () => (<div><br/>Tray would render on click</div>), // eslint-disable-line react/display-name
  scope: ''
}


export const standard = () => (
  <AlignmentButton {...defaultProps} />
)
