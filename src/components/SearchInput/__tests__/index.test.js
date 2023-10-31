import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import { IconSearchLine, IconEndSolid } from '@instructure/ui-icons'
import SearchInput from '../index'
import checkA11y from '../../../test/checkA11y'
import { IconButton } from '@instructure/ui-buttons'

describe('SearchInput', () => {
  function makeProps (props = {}) {
    return Object.assign({
      onChange: sinon.spy(),
      onClear: sinon.spy(),
      searchText: ''
    }, props)
  }

  it('includes a search icon', () => {
    const wrapper = mount(<SearchInput {...makeProps()} />)
    expect(wrapper.find(IconSearchLine)).to.have.length(1)
  })

  it('includes a clear search icon when text is in the search field', () => {
    const wrapper = mount(<SearchInput {...makeProps({searchText: 'x'})} />)
    expect(wrapper.find(IconEndSolid)).to.have.length(1)
  })

  it('includes a clear search button when text is in the search field', () => {
    const props = makeProps({searchText: 'x'})
    const wrapper = mount(<SearchInput {...props} />)
    expect(wrapper.find(IconButton)).to.have.length(1)
  })

  it('calls onClear when button is clicked', () => {
    const props = makeProps({searchText: 'x'})
    const wrapper = mount(<SearchInput {...props} />)
    const clear = wrapper.find(IconButton)
    clear.simulate('click')

    expect(props.onClear.calledOnce).to.be.true
  })

  it('meets a11y standards', () => {
    return checkA11y(<SearchInput {...makeProps()} />)
  })
})
