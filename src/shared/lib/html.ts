/**
 * Long texts written in u-code's rich-text editor are stored as HTML (FAQ answers, About us,
 * notification content). These helpers show them without trusting them: only formatting tags
 * survive, every attribute is dropped except a link's http(s)/mailto/tel address.
 */

const ALLOWED = new Set([
  'P',
  'BR',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'S',
  'UL',
  'OL',
  'LI',
  'A',
  'H1',
  'H2',
  'H3',
  'H4',
  'BLOCKQUOTE',
  'SPAN',
  'DIV',
])
const SAFE_HREF = /^(https?:|mailto:|tel:)/i

/** Does this text carry HTML markup (as opposed to plain text)? */
export const looksLikeHtml = (text: string) => /<\/?[a-z][\s\S]*?>/i.test(text)

function clean(node: Node, doc: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) return doc.createTextNode(node.textContent ?? '')
  if (node.nodeType !== Node.ELEMENT_NODE) return null
  const el = node as Element
  const children = [...el.childNodes].map((c) => clean(c, doc)).filter((c): c is Node => !!c)
  // Unknown tags (script, style, img, iframe…) lose the tag; harmless text inside stays,
  // except for script/style whose content is code, not text.
  if (!ALLOWED.has(el.tagName)) {
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return null
    const fragment = doc.createDocumentFragment()
    children.forEach((c) => fragment.appendChild(c))
    return fragment
  }
  const out = doc.createElement(el.tagName)
  if (el.tagName === 'A') {
    const href = el.getAttribute('href') ?? ''
    if (SAFE_HREF.test(href)) {
      out.setAttribute('href', href)
      out.setAttribute('target', '_blank')
      out.setAttribute('rel', 'noreferrer')
    }
  }
  children.forEach((c) => out.appendChild(c))
  return out
}

/** The HTML with only formatting tags kept, safe to render. */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const container = doc.createElement('div')
  ;[...doc.body.childNodes].forEach((n) => {
    const c = clean(n, doc)
    if (c) container.appendChild(c)
  })
  return container.innerHTML
}

/** Plain text of an HTML value, for one-line cells and search: block tags become spaces. */
export function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(
    html.replace(/<(br|\/p|\/li|\/div|\/h\d)\b[^>]*>/gi, ' '),
    'text/html',
  )
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}
