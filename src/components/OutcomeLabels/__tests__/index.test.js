import { expect } from 'chai'
import React from 'react'
import { render, shallow } from 'enzyme'
import { IconOutcomesLine } from '@instructure/ui-icons'
import OutcomeLabels from '../index'
import checkA11y from '../../../test/checkA11y'

describe('OutcomeLabels', () => {
  function makeProps (props = {}) {
    const outcomes = [
      { id: '1', label: 'ABC', title: 'Title1' },
      { id: '2', label: 'DEF', title: 'Title2' },
      { id: '3', label: 'GHI', title: 'Title3' },
    ]

    return Object.assign({
      outcomes
    }, props)
  }

  it('renders an icon', () => {
    const wrapper = shallow(<OutcomeLabels {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(IconOutcomesLine)).to.have.length(1)
  })

  it('renders outcome titles', () => {
    const wrapper = render(<OutcomeLabels {...makeProps()} />)
    const text = wrapper.text()
    expect(text.match(/Title1/)).to.be.truthy
    expect(text.match(/Title2/)).to.be.truthy
    expect(text.match(/Title3/)).to.be.truthy
  })

  it('does not render outcome labels', () => {
    const wrapper = render(<OutcomeLabels {...makeProps()} />)
    const text = wrapper.text()
    expect(text.match(/ABC/)).to.be.falsey
    expect(text.match(/DEF/)).to.be.falsey
    expect(text.match(/GHI/)).to.be.falsey
  })

  it('renders default text when outcome list empty', () => {
    const props = makeProps({ outcomes: [] })

    const wrapper = render(<OutcomeLabels {...props} />)
    expect(wrapper.text().match(/No Outcomes are currently selected/)).to.be.truthy
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeLabels {...makeProps()} />)
  })
})
