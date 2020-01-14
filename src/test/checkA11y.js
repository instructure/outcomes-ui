import { mount } from 'enzyme'
import axe from 'axe-core'

import { expect } from 'chai'

export default function checkA11y (reactElement, options = {}) {
  // We can't run aXe outside the browser
  if (process && process.title !== 'browser') {
    return Promise.resolve()
  }

  const ignores = options.ignores || []

  const wrapper = mount(reactElement, { attachTo: document.getElementById('testbed') })
  const node = wrapper.getDOMNode() // eslint-disable-line react/no-find-dom-node

  document.querySelectorAll('*[aria-labelledby]').forEach((el) => {
    el.getAttribute('aria-labelledby').split(' ').forEach((id) => {
      const message = 'aria-labelledby cannot reference parent'
      expect(document.getElementById(id).contains(el), message).to.be.false
    })
  })

  const axeConfig = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'section508', 'best-practice']
    },
    rules: {
      'color-contrast': { enabled: false } // TODO: high contrast mode
    }
  }

  return axe.run(node, axeConfig)
    .then((result) => {
      wrapper.unmount()

      const violations = result.violations.filter((violation) => {
        return !ignores.includes(violation.id)
      })
      if (violations.length > 0) {
        throw new Error(JSON.stringify(violations))
      }
      return result
    })
}
