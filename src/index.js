import DOMHighlight from './utils/DOMHighlight.js'
import DOMPath from './utils/DOMPath.js'
import DOMSelector from './utils/DOMSelector.js'

let currentElement = null
let currentElementXpath = null

document.addEventListener('DOMContentLoaded', () => {
  DOMHighlight.start()
})

document.addEventListener('mousemove', (e) => {
  if (e.target === currentElement) return
  currentElement = e.target

  currentElementXpath = DOMPath.xPath(currentElement)

  // Remove id, nth-of-type
  // currentElementXpath = currentElementXpath.replace(/\[\d+\]/g, '')

  DOMHighlight.highlightElements(DOMSelector.getElementsByXPath(currentElementXpath))
})

document.addEventListener('click', () => {
  console.log(currentElementXpath)
})
