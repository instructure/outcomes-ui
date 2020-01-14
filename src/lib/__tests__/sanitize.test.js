import { expect } from 'chai'

import { sanitizeHtml, sanitizeHtmlForList } from '../sanitize'

describe('sanitizeForHtml', () => {
  it('cleans invalid tags', () => {
    const invalid = '<monkey>tag isn\'t closed'
    expect(sanitizeHtml(invalid)).to.include('</monkey>')
  })

  it('replaces equation images', () => {
    const equationImage = 'Some text with an <img src="/equation_images/image" />'
    expect(sanitizeHtml(equationImage)).to.include('canvas.instructure.com/equation_images/image')
  })

  it('leaves other images alone', () => {
    const otherImage = 'Some text with <img src="/another_image" />'
    expect(sanitizeHtml(otherImage)).to.eq(otherImage)
  })
})

describe('sanitizeHtmlForList', () => {
  it('cleans invalid tags', () => {
    const invalid = '<i>tag isn\'t closed'
    expect(sanitizeHtmlForList(invalid)).to.include('</i>')
  })

  it('strips unsupported tags', () => {
    const unsupported = 'I have <media>media</media> tags and <table>table</table> tags and <blink>blink</blink> tags'
    expect(sanitizeHtmlForList(unsupported)).to.eq('I have media tags and table tags and blink tags')
  })

  it('leaves supported tags', () => {
    const supported = 'I have <p>paragraph</p> tags and <i>italic</i> tags and <strong>strong</strong> tags'
    expect(sanitizeHtmlForList(supported)).to.eq(supported)
  })
})
