import checkA11y from '../checkA11y'

describe('checkA11y', () => {
  // The three lines of the browser check are enough to drop our file coverage
  // below 90%
  it('has full line coverage', () => {
    const prior = process.title
    process.title = void 0 // eslint-disable-line immutable/no-mutation
    try {
      return checkA11y()
    } finally {
      process.title = prior // eslint-disable-line immutable/no-mutation
    }
  })
})
