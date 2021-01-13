import DOMHighlight from './utils/DOMHighlight.js'
import DOMPath from './utils/DOMPath.js'
import DOMPicker from './utils/DOMPicker.js'

let currentElement = null
let currentNodes = []
let currentSelector = null
let currentSelectorArr = []
let specificSelectors = []
let inputDepth = null
let inputSpecificity = null

function highlight() {
  currentNodes = document.querySelectorAll(currentSelector)
  DOMHighlight.highlightElements(currentNodes)
}

function getSpecificSelectors() {
  if (!currentSelector) return
  specificSelectors = DOMPath.getSpecificCssPaths(currentSelector)
}

function setSpecificSelectors() {
  DOMPicker.setInputRangeData(inputSpecificity, specificSelectors, specificSelectors.length - 2)
  // inputSpecificity.dispatchEvent(new Event('input'))
}

document.addEventListener('DOMContentLoaded', () => {
  DOMPicker.start()
  DOMHighlight.start()
  inputDepth = document.querySelector('#dom-picker-depth input')
  inputSpecificity = document.querySelector('#dom-picker-specificity input')

  inputDepth.addEventListener('input', function(e) {
    currentSelector = currentSelectorArr[e.target.value]
    // console.log(currentSelector)
    getSpecificSelectors()
    setSpecificSelectors()
    highlight()
  })

  inputSpecificity.addEventListener('input', function(e) {
    currentSelector = specificSelectors[e.target.value]
    // console.log(currentSelector)
    highlight()
  })
})

document.addEventListener('mousemove', (e) => {
  if (e.target === currentElement) return
  currentElement = e.target

  if (currentSelector) return
  DOMHighlight.highlightElements(document.querySelectorAll(DOMPath.cssPath(currentElement)))
})

document.addEventListener('click', () => {
  if (currentSelector) {
    currentSelector = null
    return
  }

  currentSelector = DOMPath.cssPath(currentElement)
  currentSelectorArr = currentSelector.split(' > ')
  DOMPicker.setInputRangeData(inputDepth, currentSelectorArr)

  getSpecificSelectors()
  setSpecificSelectors()

  inputSpecificity.dispatchEvent(new Event('input'))
})
