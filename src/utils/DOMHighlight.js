const DOMHighlight = {}

const NoPaths = 'M0 0'

const css = `
#dom-highlight {
  cursor: crosshair;
  box-sizing: border-box;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  position: fixed;
  pointer-events: none;
}
#dom-highlight > path:first-child {
  fill: rgba(0,0,0,0);
  fill-rule: evenodd;
}
#dom-highlight > path + path {
  stroke: #F00;
  stroke-width: 0.5px;
  fill: rgba(255,63,63,0.25);
}
`

DOMHighlight.svgRoot = null
DOMHighlight.svgOcean = null
DOMHighlight.svgIslands = null

DOMHighlight.targetElements = []

DOMHighlight.getElementBoundingClientRect = function(elem) {
  let rect = typeof elem.getBoundingClientRect === 'function'
    ? elem.getBoundingClientRect()
    : { height: 0, left: 0, top: 0, width: 0 }

  if (rect.width !== 0 && rect.height !== 0) {
    return rect
  }

  let left = rect.left
  let right = rect.right
  let top = rect.top
  let bottom = rect.bottom

  for (const child of elem.children) {
    rect = DOMHighlight.getElementBoundingClientRect(child)
    if (rect.width === 0 || rect.height === 0) {
      continue
    }
    if (rect.left < left) { left = rect.left }
    if (rect.right > right) { right = rect.right }
    if (rect.top < top) { top = rect.top }
    if (rect.bottom > bottom) { bottom = rect.bottom }
  }

  return {
    height: bottom - top,
    left,
    top,
    width: right - left
  }
}

DOMHighlight.highlightElements = function(elems, force) {
  // To make mouse move handler more efficient
  if (
    (force !== true) &&
    (elems.length === DOMHighlight.targetElements.length) &&
    (elems.length === 0 || elems[0] === DOMHighlight.targetElements[0])
  ) {
    return
  }
  DOMHighlight.targetElements = []

  const ow = self.innerWidth
  const oh = self.innerHeight

  let islands = []

  for (const elem of elems) {
    // if (elem === pickerRoot) { continue }
    DOMHighlight.targetElements.push(elem)
    const rect = DOMHighlight.getElementBoundingClientRect(elem)
    // Ignore offscreen areas
    if (
      rect.left > ow || rect.top > oh ||
          rect.left + rect.width < 0 || rect.top + rect.height < 0
    ) {
      continue
    }
    islands.push(`M${rect.left} ${rect.top}h${rect.width}v${rect.height}h-${rect.width}z`)
  }

  let ocean = `M0 0h${ow}v${oh}h-${ow}z`
  islands = islands.join('')
  ocean += islands

  DOMHighlight.svgOcean.setAttribute('d', ocean)
  DOMHighlight.svgIslands.setAttribute('d', islands || NoPaths)
}

DOMHighlight.createSvg = function() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('id', 'dom-highlight')
  const svgOcean = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  const svgIslands = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  svg.appendChild(svgOcean)
  svg.appendChild(svgIslands)
  return svg
}

DOMHighlight.start = function() {
  const onViewportChanged = function() {
    DOMHighlight.highlightElements(DOMHighlight.targetElements, true)
  }
  self.addEventListener('scroll', onViewportChanged, { passive: true })
  self.addEventListener('resize', onViewportChanged, { passive: true })

  DOMHighlight.svgRoot = DOMHighlight.createSvg()
  DOMHighlight.svgOcean = DOMHighlight.svgRoot.children[0]
  DOMHighlight.svgIslands = DOMHighlight.svgRoot.children[1]
  document.body.appendChild(DOMHighlight.svgRoot)

  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`)
}

export default DOMHighlight
