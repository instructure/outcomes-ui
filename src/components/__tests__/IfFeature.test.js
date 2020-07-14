import React, {isValidElement} from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'

import * as constants from '../../constants'
import IfFeature from '../IfFeature'

describe('IfFeature', () => {
  describe('with features in constants.js', () => {
    let getFeaturesStub
    beforeEach(() => { getFeaturesStub = sinon.stub(constants, 'getFeatureFlags').returns(['feature1', 'feature2']) })
    afterEach(() => { getFeaturesStub.restore() })

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

  describe('with no features in constants.js', () => {
    let getFeaturesStub
    beforeEach(() => { getFeaturesStub = sinon.stub(constants, 'getFeatureFlags').returns([]) })
    afterEach(() => { getFeaturesStub.restore() })
    it('throws an error if given an unknown feature', () => {
      expect(() => shallow(<IfFeature name={'feature1'} features={[]}/>)).to.throw(Error)
    })
  })
})
