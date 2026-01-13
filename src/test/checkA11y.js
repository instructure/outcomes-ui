import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { expect } from '@jest/globals'

expect.extend(toHaveNoViolations)

export default async function checkA11y (reactElement, options = {}) {
  // We can't run aXe outside the browser
  if (process && process.title !== 'browser') {
    return Promise.resolve()
  }

  const ignores = options.ignores || []

  const { container, unmount } = render(reactElement, {
    container: document.getElementById('testbed') || document.body
  })

  document.querySelectorAll('*[aria-labelledby]').forEach((el) => {
    el.getAttribute('aria-labelledby').split(' ').forEach((id) => {
      const labelElement = document.getElementById(id)
      if (labelElement && labelElement.contains(el)) {
        throw new Error('aria-labelledby cannot reference parent')
      }
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

  const results = await axe(container, axeConfig)

  unmount()

  const violations = results.violations.filter((violation) => {
    return !ignores.includes(violation.id)
  })

  if (violations.length > 0) {
    throw new Error(JSON.stringify(violations))
  }

  return results
}
