import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { getStore, makeScope, makeUserScope } from '../store'

const makeSDKComponent = (ComponentClass, additionalPropTypes = {}) => class extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    scope: PropTypes.string,
    contextUuid: PropTypes.string,
    artifactType: PropTypes.string.isRequired,
    artifactId: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    jwt: PropTypes.string.isRequired,
    userUuid: PropTypes.string,
    ...additionalPropTypes
  }

  static defaultProps = {
    store: null,
    scope: null,
    contextUuid: '',
    userUuid: null
  }

  static displayName = `SDKComponent(${ComponentClass.displayName})`

  contextUuid () {
    return this.props.contextUuid || ''
  }

  scope () {
    const { scope, artifactType, artifactId, userUuid } = this.props
    const userScope = makeUserScope(artifactType, artifactId, userUuid)
    const artifactScope = makeScope(artifactType, artifactId)
    const generatedScope = userUuid ? userScope : artifactScope
    // eslint-disable-next-line immutable/no-mutation
    return scope || generatedScope
  }

  store () {
    const { store, host, jwt } = this.props
    // eslint-disable-next-line immutable/no-mutation
    return store || getStore(host, jwt, this.scope(), this.contextUuid()) // eslint-disable-line immutable/no-mutation
  }

  propsForChild () {
    return {
      ...this.props,
      contextUuid: this.contextUuid(),
      scope: this.scope()
    }
  }

  render () {
    return (
      <Provider store={this.store()}>
        <ComponentClass {...this.propsForChild()} />
      </Provider>
    )
  }
}

export default makeSDKComponent
