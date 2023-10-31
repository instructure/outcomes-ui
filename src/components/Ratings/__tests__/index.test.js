import { expect } from 'chai'
import React from 'react'
import { shallow, mount } from 'enzyme'
import Ratings from '../index'
import checkA11y from '../../../test/checkA11y'
import { ratings } from '../../../test/mockOutcomesData'
import { Text } from '@instructure/ui-text'

describe('Ratings', () => {
  function makeProps (props = {}) {
    return Object.assign({
      ratings: ratings,
    }, props)
  }

  it('renders a table for the ratings', () => {
    const wrapper = shallow(<Ratings {...makeProps()} />)
    expect(wrapper.find('Table')).to.have.length(1)
  })

  it('displays the mastery points correctly', () => {
    const wrapper = mount(<Ratings {...makeProps({masteryPercent: 0.6, pointsPossible: 5})} />)
    // Text components render description in this way:
    // 0: Exceeds Expectations
    // 1: Meets Expectations
    // 2: Does Not Meet Expectations
    // 3: Mastery at:
    // 4: 3 points
    const text_component_count = 5
    const mastery_points_position = 4
    expect(wrapper.find(Text)).to.have.length(text_component_count)
    const text = wrapper.find(Text).at(mastery_points_position)
    expect(text.text()).to.match(/3 points/)
  })

  it('calculates the ratings points correctly', () => {
    const wrapper = mount(<Ratings {...makeProps({pointsPossible: 5})} />)
    const exceeds = wrapper.find('PresentationContent').at(1)
    expect(exceeds.text()).to.match(/5/)
    const meets = wrapper.find('PresentationContent').at(3)
    expect(meets.text()).to.match(/3/)
    const zero = wrapper.find('PresentationContent').at(5)
    expect(zero.text()).to.match(/0/)
  })

  it('formats the table in one column if displayed in tray', () => {
    const wrapper = mount(<Ratings {...makeProps({isTray: true})} />)
    expect(wrapper.find('Table').find('th')).to.have.length(1)
  })

  it('dispalys the correct text for points when displayed in tray', () => {
    const wrapper = mount(<Ratings {...makeProps({pointsPossible: 5, isTray: true})} />)
    const exceeds = wrapper.find('PresentationContent').at(1)
    expect(exceeds.text()).to.match(/5 points/)
    const meets = wrapper.find('PresentationContent').at(3)
    expect(meets.text()).to.match(/3 points/)
    const zero = wrapper.find('PresentationContent').at(5)
    expect(zero.text()).to.match(/0 points/)
  })

  it('meets a11y standards', () => {
    return checkA11y(<Ratings {...makeProps()} />)
  })
})
