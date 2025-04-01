import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import { Pagination as InstuiPagination } from '@instructure/ui-pagination'

import Pagination from '../index'

describe('Pagination', () => {
  function makeProps (props = {}) {
    return Object.assign({
      numPages: 2,
      page: 1,
      updatePage: sinon.spy(),
    }, props)
  }

  it('renders page numbers', () => {
    const wrapper = mount(<Pagination {...makeProps()} />)
    expect(wrapper.find(InstuiPagination.Page)).to.have.length(2)
  })

  it('calls updatePage when a page is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<Pagination {...props} />)
    wrapper.find(InstuiPagination.Page).last().find('button').simulate('click')
    expect(props.updatePage.calledWith(2)).to.be.true
  })


  it('does not include pagination for 0 results', () => {
    const props = makeProps({ numPages: 0 })
    const wrapper = mount(<Pagination {...props} />, {disableLifecycleMethods: true})
    const nextPageButton = wrapper.find('button').findWhere((z) => z.text() == 'Next Page')
    expect(nextPageButton).to.have.length(0)
  })
})
