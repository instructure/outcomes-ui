import 'core-js'
import 'regenerator-runtime/runtime'
// eslint-disable-next-line import/no-extraneous-dependencies
import Enzyme from 'enzyme'
// eslint-disable-next-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

const testbed = document.createElement('div')
testbed.setAttribute('id', 'testbed')
document.body.appendChild(testbed)

// require all modules ending in "_test" from the
// current directory and all subdirectories
const testsContext = require.context('.', true, /__tests__.*\.test$/)
testsContext.keys().forEach(testsContext)
