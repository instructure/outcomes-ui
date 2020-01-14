import { expect } from 'chai'
import React from 'react'
import { mount } from 'enzyme'
import AlignmentCount from '../index'
import checkA11y from '../../../test/checkA11y'

describe('AlignmentCount', () => {
  function makeProps (props = {}) {
    return Object.assign({
      count: 100
    }, props)
  }

  it('renders the count', () => {
    const wrapper = mount(<AlignmentCount {...makeProps()} />)
    expect(wrapper.text()).to.match(/\(100\)/)
  })

  it('does not render when count is null', () => {
    const props = makeProps({ count: null })
    const wrapper = mount(<AlignmentCount {...props} />)
    expect(wrapper.text()).to.equal('')
  })

  it('meets a11y standards', () => {
    return checkA11y(<AlignmentCount {...makeProps()} />)
  })
})
