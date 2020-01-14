import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { render, shallow } from 'enzyme'
import { IconOutcomesLine } from '@instructure/ui-icons'
import OutcomeLabels from '../index'
import checkA11y from '../../../test/checkA11y'

describe('OutcomeLabels', () => {
  function makeProps (props = {}) {
    const getOutcome = sinon.stub()
    getOutcome.withArgs('1').returns({ id: '1', label: 'ABC', title: 'Title1' })
    getOutcome.withArgs('2').returns({ id: '2', label: 'DEF', title: 'Title2' })
    getOutcome.withArgs('3').returns({ id: '3', label: 'GHI', title: 'Title3' })
    getOutcome.withArgs('4').returns(
      { id: '4', label: 'JKL', title: 'supercalifragilisticexpialidocious' }
    )

    return Object.assign({
      ids: ['1', '2', '3'],
      getOutcome
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
    const props = makeProps({ ids: [] })

    const wrapper = render(<OutcomeLabels {...props} />)
    expect(wrapper.text().match(/No Outcomes are currently selected/)).to.be.truthy
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeLabels {...makeProps()} />)
  })
})
