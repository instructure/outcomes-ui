import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import ExportCSVButton, { headers } from '../index'
import checkA11y from '../../../../test/checkA11y'
import { NOT_FETCHING } from '../../../../constants'

describe('OutcomesPerStudent/ExportCSVButton', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })

  const makeProps = (props) => {
    return {
      fetchCSVData: sinon.spy(),
      formatCSVData: sinon.spy(),
      fetchingStatus: NOT_FETCHING,
      artifactId: 1,
      ...props
    }
  }

  it('renders the export CSV button', () => {
    const wrapper = mount(<ExportCSVButton {...makeProps({})} />)
    expect(wrapper.text()).to.match(/Export CSV/)
  })

  it('export CSV button is enabled by default', () => {
    const wrapper = mount(<ExportCSVButton {...makeProps({})} />)
    // Enzyme finds two Button components because of the instui decorator on the component
    expect(wrapper.find('Flex Button').at(0).prop('interaction')).to.equal('enabled')
  })

  it('export CSV button color is primary', () => {
    const wrapper = mount(<ExportCSVButton {...makeProps({})} />)
    // Enzyme finds two Button components because of the instui decorator on the component
    expect(wrapper.find('Flex Button').at(0).prop('color')).to.equal('primary')
  })

  it('export CSV button has onClick', () => {
    const wrapper = mount(<ExportCSVButton {...makeProps({})} />)
    // Enzyme finds two Button components because of the instui decorator on the component
    expect(wrapper.find('Flex Button').at(0).prop('onClick')).to.be.not.undefined
  })

  it('click export CSV calls fetchCSVData', () => {
    const props = makeProps({})
    const wrapper = mount(<ExportCSVButton {...props} />)
    // Enzyme finds two Button components because of the instui decorator on the component
    const button = wrapper.find('Flex Button').at(0)
    button.simulate('click')
    expect(props.fetchCSVData).to.have.been.called
  })

  it('starting export changes the export CSV button to cancel export', () => {
    const props = makeProps({})
    const wrapper = mount(<ExportCSVButton {...props} />)
    // Enzyme finds two Button components because of the instui decorator on the component
    const button = wrapper.find('Flex Button').at(0)
    button.simulate('click')
    expect(wrapper.text()).not.to.match(/Export CSV/)
    expect(wrapper.text()).to.match(/Cancel Export/)
    expect(wrapper.find('Flex Button').at(0).prop('interaction')).to.equal('enabled')
    expect(wrapper.find('Flex Button').at(0).prop('color')).to.equal('secondary')
  })

  it('starting export displays the ProgressBar', () => {
    const props = makeProps({})
    const wrapper = mount(<ExportCSVButton {...props} />)
    // Enzyme finds two Button components because of the instui decorator on the component
    const button = wrapper.find('Flex Button').at(0)
    button.simulate('click')
    expect(wrapper.text()).to.match(/Exporting/)
    expect(wrapper.find('ProgressBar')).to.exist
  })

  it('correct headers are passed into CSVLink', () => {
    const wrapper = mount(<ExportCSVButton {...makeProps({})} />)
    expect(wrapper.find('Flex span CSVLink').prop('headers')).to.equal(headers)
  })

  it('CSVLink is initially passed in no row data', () => {
    const wrapper = mount(<ExportCSVButton {...makeProps({})} />)
    expect(wrapper.find('Flex span CSVLink').prop('data')).to.be.empty
  })

  it('CSVLink is not keyboard accessible', () => {
    const wrapper = mount(<ExportCSVButton {...makeProps({})} />)
    expect(wrapper.find('Flex span CSVLink').prop('tabIndex')).to.equal(-1)
  })

  it('meets a11y standards', () => {
    return checkA11y(<ExportCSVButton {...makeProps({})} />)
  })
})
