import DOMPurify from 'dompurify'

const CONFIG = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: [
    'allowfullscreen',
    'allow',
    'frameborder',
    'sandbox',
    'target',
    'data-media-id',
    'data-media-type'
  ],
  FORBID_TAGS: ['form', 'input', 'button', 'textarea', 'select', 'option']
}

// Rewrite Canvas equation-image relative URLs to absolute,
// preserving the previous behavior of this module.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'IMG') {
    const src = node.getAttribute('src') || ''
    if (src.indexOf('/equation_images') === 0) {
      node.setAttribute('src', `https://canvas.instructure.com${src}`)
      node.setAttribute('style', 'vertical-align: middle')
    }
  }
  // Harden links opened in a new tab against tab-nabbing.
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function sanitizeHtml (html) {
  return DOMPurify.sanitize(html == null ? '' : html, CONFIG)
}
