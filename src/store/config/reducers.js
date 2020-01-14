import { fromJS } from 'immutable'

const config = (conf) => () => fromJS(conf)
export default config
