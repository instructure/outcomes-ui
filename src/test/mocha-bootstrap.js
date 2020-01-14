import chai from 'chai'
import crypto from 'crypto'
import sinonChai from 'sinon-chai'
import { JSDOM } from 'jsdom'

import register from 'ignore-styles'

// By default, ignore-styles just returns an empty object. Unfortunately, many
// of our tests select elements with a specific style name. We need to return
// unique style names so our tests and files can properly use imported names.
//
// We could get even fancier here and verify the styles exist in the css file,
// but that's a lot of work. Any problems should be caught in the karma tests
// anyway.
register(void 0, (module, filename) => {
  const fileHash = crypto.createHash('sha256').update(filename).digest('hex').slice(0, 8)
  const styleHandler = {
    get: (target, name) => {
      // Ugh, babel import magic means we have to specify this, see
      // https://github.com/babel/babel/issues/5079
      if (name === '__esModule') {
        return false
      } else if (typeof name === 'string') {
        return `${fileHash}-${name}`
      }
    }
  }

  // eslint-disable-next-line no-param-reassign
  module.exports = new Proxy({ fake: true }, styleHandler)
})

chai.use(sinonChai)

// Many tests require the global document / window objects, which we need to
// fake
const dom = new JSDOM('<!doctype html><html><body></body></html>')
global.window = dom.window // eslint-disable-line immutable/no-mutation
global.document = dom.window.document // eslint-disable-line immutable/no-mutation
global.navigator = dom.window.navigator // eslint-disable-line immutable/no-mutation
