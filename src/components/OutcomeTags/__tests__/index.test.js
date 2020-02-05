import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { render, shallow, mount } from 'enzyme'
import { IconOutcomesLine } from '@instructure/ui-icons'
import OutcomeTags from '../index'
import checkA11y from '../../../test/checkA11y'

describe('OutcomeTags', () => {
  function makeProps (props = {}) {
    const deselectOutcomeIds = sinon.stub()
    const outcomes = [
      { id: '1', label: 'ABC', title: 'Title1' },
      { id: '2', label: 'DEF', title: 'Title2' },
      { id: '3', label: 'GHI', title: 'Title3' }
    ]

    return Object.assign({
      outcomes,
      deselectOutcomeIds
    }, props)
  }

  it('renders an icon', () => {
    const wrapper = shallow(<OutcomeTags {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(IconOutcomesLine)).to.have.length(1)
  })

  it('renders tags for each outcome', () => {
    const wrapper = shallow(<OutcomeTags {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Tag')).to.have.length(3)
  })

  it('removes alignment when tag is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeTags {...props} />)
    wrapper.find('Tag').first().simulate('click')
    expect(props.deselectOutcomeIds.calledOnce).to.be.true
    expect(props.deselectOutcomeIds.calledWith(['1'])).to.be.true
  })

  it('renders outcome titles', () => {
    const wrapper = render(<OutcomeTags {...makeProps()} />)
    const text = wrapper.text()
    expect(text.match(/Title1/)).to.be.truthy
    expect(text.match(/Title2/)).to.be.truthy
    expect(text.match(/Title3/)).to.be.truthy
  })

  it('does not render outcome labels', () => {
    const wrapper = render(<OutcomeTags {...makeProps()} />)
    const text = wrapper.text()
    expect(text.match(/ABC/)).to.be.falsey
    expect(text.match(/DEF/)).to.be.falsey
    expect(text.match(/GHI/)).to.be.falsey
  })

  it('renders default text when outcome list empty', () => {
    const props = makeProps({ outcomes: [] })

    const wrapper = render(<OutcomeTags {...props} />)
    expect(wrapper.text().match(/No Outcomes are currently selected/)).to.be.truthy
  })

  it('focuses on the prior tag when current tag deleted', (done) => {
    const wrapper = mount(<OutcomeTags {...makeProps()} />)
    const focusInput = sinon.spy(wrapper.instance(), 'focusInput')
    setTimeout(() => {
      const last = wrapper.find('Tag').at(2)
      const previous = wrapper.find('Tag').at(1)
      const focus = sinon.spy(previous.find('button').instance(), 'focus')
      const remove = last.prop('onClick')
      remove()
      setTimeout(() => {
        expect(focus.calledOnce).to.be.true
        expect(focusInput.calledOnce).to.be.true
        done()
      }, 1)
    }, 1)
  })

  it('focuses on the next tag when the first tag is deleted', (done) => {
    const wrapper = mount(<OutcomeTags {...makeProps()} />)
    const focusInput = sinon.spy(wrapper.instance(), 'focusInput')
    setTimeout(() => {
      const first = wrapper.find('Tag').at(0)
      const next = wrapper.find('Tag').at(1)
      const focus = sinon.spy(next.find('button').instance(), 'focus')
      const remove = first.prop('onClick')
      remove()
      setTimeout(() => {
        expect(focus.calledOnce).to.be.true
        expect(focusInput.calledOnce).to.be.true
        done()
      }, 1)
    }, 1)
  })

  it ('focuses on empty results div when all tags are deleted', (done) => {
    const wrapper = mount(<OutcomeTags {...makeProps()} />)
    setTimeout(() => {
      [0, 1, 2].forEach(tagIndex => {
        const tag = wrapper.find('Tag').at(tagIndex)
        const remove = tag.prop('onClick')
        remove()
      })
      setTimeout(() => {
        expect(document.activeElement.tabIndex).to.equal(-1)
        done()
      }, 1)
    }, 1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeTags {...makeProps()} />)
  })
})
