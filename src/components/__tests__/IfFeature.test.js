import React, {isValidElement} from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'

import IfFeature from '../IfFeature'

describe('IfFeature', () => {
  it('returns a valid React Element', () => {
    const element = <IfFeature name={'feature1'} features={[]}/>
    expect(isValidElement(element)).to.be.true
  })

  it('renders an IfFeature', () => {
    expect(mount(<IfFeature name={'feature1'} features={[]} />).find('IfFeature')).to.have.length(1)
  })

  context('when turned off', () => {
    it('renders without the child', () => {
      const wrapper = shallow(
        <IfFeature name={'feature1'} features={['feature2']}>
          <div>Hello!!!</div>
        </IfFeature>
      )
      expect(wrapper.find('div')).to.have.length(0)
    })
  })

  context('when turned on', () => {
    it('renders with the child', () => {
      const wrapper = shallow(
        <IfFeature
          features={['feature1']}
          name={'feature1'}
        >
          <div>Hello!!!</div>
        </IfFeature>
      )
      expect(wrapper.find('div')).to.have.length(1)
      expect(wrapper.find('div').text()).to.eq('Hello!!!')
    })
  })
})
