import chai, { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomesPerStudent from '../index'
import checkA11y from '../../../test/checkA11y'
import styles from '../styles.css'
import { REPORT_DOWNLOAD_FF } from '../../../constants'

chai.use(require('sinon-chai'))

describe('OutcomesPerStudent/index', () => {
  function makeProps (props = {}) {
    return Object.assign({
      loadPage: sinon.stub().returns(Promise.resolve()),
      clearReportStore: sinon.spy(),
      getReportOutcome: sinon.stub().returns({ id: 1, label: 'Foo.PRQ.2', title: 'Learn stuff' }),
      getScore: sinon.spy(),
      setError: sinon.spy(),
      isOpen: sinon.stub().returns(false),
      viewReportAlignment: sinon.spy(),
      closeReportAlignment: sinon.spy(),
      artifactType: 'foo',
      artifactId: 'bar',
      hasAnyOutcomes: true,
      currentPage: 3,
      pageCount: 5,
      rollups: [
        {
          outcomeId: 101,
          count: 100,
          mastery_count: 11,
          alignedItems: 1
        },
        {
          outcomeId: 202,
          alignedItems: 5,
          mastery_count: 19,
          count: 20
        },
        {
          outcomeId: 303,
          mastery_count: 12,
          count: 20
        }
      ],
      users: [
        {
          uuid: 1,
          full_name: 'Darius Jackson'
        },
        {
          uuid: 2,
          full_name: 'Penelope Cooper'
        },
        {
          uuid: 3,
          full_name: 'Gerry Gergich'
        },
        {
          uuid: 4,
          full_name: 'Slim Pickens'
        },
        {
          uuid: 5,
          full_name: 'Sir Darryl Roundtree'
        }
      ],
      features: []
    }, props)
  }

  it('renders a header for each outcome', () => {
    const wrapper = shallow(<OutcomesPerStudent {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Header')).to.have.length(3)
  })

  it('generates the correct viewReportAlignment method for each header', () => {
    const props = makeProps()
    const wrapper = shallow(<OutcomesPerStudent {...props} />, {disableLifecycleMethods: true})
    const header = wrapper.find('Header').last()
    const viewReportAlignment = header.prop('viewReportAlignment')
    viewReportAlignment()

    expect(props.viewReportAlignment).to.have.been.calledOnce
    expect(props.viewReportAlignment).to.have.been.calledWith(303)
  })

  it('renders a row for each student', () => {
    const wrapper = shallow(<OutcomesPerStudent {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find(`.${styles.studentRow}`)).to.have.length(5)
  })

  it('renders a score for each student score', () => {
    const wrapper = shallow(<OutcomesPerStudent {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Score')).to.have.length(15)
  })

  it('renders pagination', () => {
    const wrapper = shallow(<OutcomesPerStudent {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('PaginationButton')).to.have.length(5)
  })

  it('renders the billboard message if no results yet exist', () => {
    const wrapper = shallow(
      <OutcomesPerStudent {...makeProps({users: [], hasAnyOutcomes: true})} />,
      {disableLifecycleMethods: true}
    )
    expect(wrapper.find('Billboard')).to.have.length(1)
    expect(wrapper.find('Billboard').prop('heading')).to.equal('Looks like you\'re a little early')
  })

  it('renders the billboard message if no outcomes are aligned', () => {
    const wrapper = shallow(
      <OutcomesPerStudent {...makeProps({users: [], hasAnyOutcomes: false})} />,
      {disableLifecycleMethods: true}
    )
    expect(wrapper.find('Billboard').prop('heading')).to.equal('There is no report here to show')
  })

  describe('ExportCSVButton', () => {
    it('renders if the FF is enabled, the page is loaded, and there are users and outcomes', () => {
      const wrapper = shallow(
        <OutcomesPerStudent {...makeProps({features: [REPORT_DOWNLOAD_FF]})} />,
        {disableLifecycleMethods: true}
      )
      expect(wrapper.find('ExportCSVButton')).to.have.length(1)
    })

    describe('does not render if', () => {
      it('the FF is disabled', () => {
        const wrapper = shallow(
          <OutcomesPerStudent {...makeProps({})} />,
          {disableLifecycleMethods: true}
        )
        expect(wrapper.find('ExportCSVButton')).to.have.length(0)
      })

      it('there are no students', () => {
        const wrapper = shallow(
          <OutcomesPerStudent {...makeProps({users: []})} />,
          {disableLifecycleMethods: true}
        )
        expect(wrapper.find('ExportCSVButton')).to.have.length(0)
      })

      it('there are no outcomes', () => {
        const wrapper = shallow(
          <OutcomesPerStudent {...makeProps({hasAnyOutcomes: false})} />,
          {disableLifecycleMethods: true}
        )
        expect(wrapper.find('ExportCSVButton')).to.have.length(0)
      })
    })
  })

  it('calls clearReportStore when about to unmount', () => {
    const props = makeProps()
    const wrapper = mount(
      <OutcomesPerStudent {...props} />
    )
    expect(props.clearReportStore).to.not.have.been.called
    wrapper.unmount()
    expect(props.clearReportStore).to.have.been.calledOnce
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomesPerStudent {...makeProps()} />)
  })
})
