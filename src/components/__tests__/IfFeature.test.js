import { expect, jest, describe, it, beforeEach, afterEach } from '@jest/globals'
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import * as constants from '../../constants'
import IfFeature from '../IfFeature'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

describe('IfFeature', () => {
  describe('with features in constants.js', () => {
    let getFeaturesStub

    beforeEach(() => {
      getFeaturesStub = jest.spyOn(constants, 'getFeatureFlags').mockReturnValue(['feature1', 'feature2'])
    })

    afterEach(() => {
      getFeaturesStub.mockRestore()
    })

    it('returns a valid React Element', () => {
      const element = <IfFeature name={'feature1'} features={[]} />
      expect(React.isValidElement(element)).toBe(true)
    })

    it('renders an IfFeature component', () => {
      const { container } = render(<IfFeature name={'feature1'} features={[]} />)
      // This verifies the component renders (no direct equivalent to find('IfFeature')
      // in react-testing-library since it focuses on what the user sees)
      expect(container).toBeTruthy()
    })

    describe('when turned off', () => {
      it('renders without the child', () => {
        render(
          <IfFeature name={'feature1'} features={['feature2']}>
            <div>Hello!!!</div>
          </IfFeature>
        )
        expect(screen.queryByText('Hello!!!')).not.toBeInTheDocument()
      })
    })

    describe('when turned on', () => {
      it('renders with the child', () => {
        render(
          <IfFeature
            features={['feature1']}
            name={'feature1'}
          >
            <div>Hello!!!</div>
          </IfFeature>
        )
        expect(screen.getByText('Hello!!!')).toBeInTheDocument()
      })
    })
  })

  describe('with no features in constants.js', () => {
    let getFeaturesStub

    beforeEach(() => {
      getFeaturesStub = jest.spyOn(constants, 'getFeatureFlags').mockReturnValue([])
    })

    afterEach(() => {
      getFeaturesStub.mockRestore()
    })

    it('throws an error if given an unknown feature', () => {
      expect(() =>
        render(<IfFeature name={'feature1'} features={[]} />))
        .toThrow('feature1 not listed as a feature flag in constants.js!')
    })
  })

  it('meets a11y standards', async () => {
    const getFeaturesStub = jest.spyOn(constants, 'getFeatureFlags').mockReturnValue(['feature1', 'feature2'])

    const { container } = render(
      <IfFeature features={['feature1']} name={'feature1'}>
        <div>Hello!!!</div>
      </IfFeature>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    getFeaturesStub.mockRestore()
  })
})
