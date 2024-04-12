import { expect } from 'chai'
import { fromJS } from 'immutable'
import {
  SET_ALIGNMENTS,
  VIEW_ALIGNMENT,
  CLOSE_ALIGNMENT,
  UPDATE_ALIGNMENT,
  SET_LAUNCH_CONTEXTS
} from '../../../constants'
import reducer from '../reducers'

describe('alignments/reducers', () => {
  const reduce = (state, type, payload) => reducer(state, { type, payload })

  const state = fromJS({
    alignmentSetId: 'originalguid',
    alignedOutcomes: [{id: '2'}, {id: '3'}],
    openAlignmentId: 10
  })

  describe('launchContexts', () => {
    it('is updated by SET_LAUNCH_CONTEXTS', () => {
      const newLaunchContexts = [{uuid: 'foo', name: 'Dave University'}]
      const newState = reduce(state, SET_LAUNCH_CONTEXTS, newLaunchContexts)
      expect(newState.get('launchContexts')?.toJS()).to.deep.equal(newLaunchContexts)
    })
  })

  describe('alignedOutcomes', () => {
    it('is updated by SET_ALIGNMENTS', () => {
      const newAlignments = {guid: 'imaguid', outcomes: [{id: '1'}, {id: '2'}, {id: '3'}]}
      const newState = reduce(state, SET_ALIGNMENTS, newAlignments)
      expect(newState.get('alignedOutcomes').toJS()).to.deep.equal(newAlignments.outcomes)
    })

    it('is updated by UPDATE_ALIGNMENT', () => {
      const outcome = { id: '3', scoring_method: 'boom' }
      const newState = reduce(state, UPDATE_ALIGNMENT, {outcome: outcome})
      expect(newState.getIn(['alignedOutcomes', 1]).toJS()).to.deep.equal(outcome)
    })
  })

  describe('openAlignmentId', () => {
    it('is set by VIEW_ALIGNMENT', () => {
      const newState = reduce(state, VIEW_ALIGNMENT, 99)
      expect(newState.get('openAlignmentId')).to.equal(99)
    })

    it('is cleared by CLOSE_ALIGNMENT', () => {
      const newState = reduce(state, CLOSE_ALIGNMENT, null)
      expect(newState.get('openAlignmentId')).to.equal(null)
    })
  })

  describe('alignmentSetId', () => {
    it('is updated by SET_ALIGNMENTS', () => {
      const newAlignmentSet = {guid: 'iamgroot', outcomes: [{id: '5'}]}
      const newState = reduce(state, SET_ALIGNMENTS, newAlignmentSet)
      expect(newState.get('alignmentSetId')).to.deep.equal(newAlignmentSet.guid)
    })
  })
})
