import libSanitizeHtml from 'sanitize-html'

function transformEquationImage (tagName, attribs) {
  return {
    tagName,
    attribs: {
      ...attribs,
      src: `https://canvas.instructure.com${attribs.src}`,
      style: 'vertical-align: middle'
    }
  }
}

function transformImage (tagName, attribs) {
  if (attribs.src != null && attribs.src.indexOf('/equation_images') === 0) {
    return transformEquationImage(tagName, attribs)
  }
  return { tagName, attribs }
}

export function sanitizeHtml (html) {
  return libSanitizeHtml(html, {
    allowedTags: false,
    allowedAttributes: false,
    transformTags: {
      img: transformImage
    }
  })
}

export function sanitizeHtmlForList (html) {
  return libSanitizeHtml(html, {
    allowedTags: [
      // format tags
      'b', 'i', 'ul', 'sub', 'sup', 'strong', 'em',
      // grouping tags
      'p', 'br', 'ol', 'ul', 'li', 'dl', 'dt', 'dd'
    ]
  })
}
