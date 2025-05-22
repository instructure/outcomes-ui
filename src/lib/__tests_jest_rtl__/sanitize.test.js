import { expect, describe, it } from '@jest/globals'
import { sanitizeHtml } from '../sanitize'

describe('sanitizeForHtml', () => {
  it('cleans invalid tags', () => {
    const invalid = '<monkey>tag isn\'t closed'
    expect(sanitizeHtml(invalid)).toContain('</monkey>')
  })

  it('replaces equation images', () => {
    const equationImage = 'Some text with an <img src="/equation_images/image" />'
    expect(sanitizeHtml(equationImage)).toContain('canvas.instructure.com/equation_images/image')
  })

  it('leaves other images alone', () => {
    const otherImage = 'Some text with <img src="/another_image" />'
    expect(sanitizeHtml(otherImage)).toBe(otherImage)
  })
})
