const DOMPicker = {}

const css = `
#dom-picker .dom-picker-form {
  display: inline-flex;
  width: auto;
  line-height: 1;
  flex-direction: column;
}

#dom-picker .dom-picker-form:not(:last-of-type) {
  margin-right: 10px;
}

#dom-picker .dom-picker-form span {
  font-size: 12px;
  font-family: monospace;
  line-height: 1;
  margin-bottom: 4px;
}

#dom-picker .dom-picker-form input {
  line-height: 1;
  color: #000;
}
#dom-picker .dom-picker-form input::-webkit-slider-runnable-track {
  min-inline-size: 0px;
  align-self: center;
  box-sizing: border-box;
  display: block;
  -webkit-user-modify: read-only !important;
  flex: 1 1 0%;
}
`

DOMPicker.createContainer = function(id) {
  const container = document.createElement('div')
  container.setAttribute('id', id)
  container.style.position = 'fixed'
  container.style.right = '10px'
  container.style.bottom = '10px'
  container.style.backgroundColor = '#fff'
  container.style.border = '1px solid #e6e6e6'
  container.style.padding = '12px'
  container.style.padding = 'line-height: 1;'
  document.body.appendChild(container)

  container.addEventListener('click', function(e) {
    e.stopPropagation()
  })
}

DOMPicker.createInputRange = function(container, id, label, options) {
  const wapper = document.createElement('div')
  wapper.setAttribute('id', id)
  wapper.classList.add('dom-picker-form')

  const title = document.createElement('span')
  title.classList.add('dom-picker-form__label')
  title.textContent = label
  wapper.appendChild(title)

  const input = document.createElement('input')
  input.classList.add('dom-picker-form__input')
  input.type = 'range'
  input.setAttribute('min', 0)
  input.setAttribute('max', 10)
  input.setAttribute('list', 'list-' + id)
  wapper.appendChild(input)

  const datalist = document.createElement('datalist')
  datalist.setAttribute('id', 'list-' + id)
  wapper.appendChild(datalist)

  container.appendChild(wapper)
}

DOMPicker.setInputRangeData = function(input, options, value) {
  const length = options.length - 1
  input.setAttribute('max', length)
  input.value = value || length
  const datalist = document.getElementById(input.getAttribute('list'))
  datalist.innerHTML = ''
  for (const option of options) {
    const optionEl = document.createElement('option')
    optionEl.setAttribute('value', option)
    datalist.appendChild(optionEl)
  }
}

DOMPicker.start = function() {
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`)
  DOMPicker.createContainer('dom-picker')
  const container = document.getElementById('dom-picker')
  DOMPicker.createInputRange(container, 'dom-picker-depth', 'depth', [])
  DOMPicker.createInputRange(container, 'dom-picker-specificity', 'specificity', [])
}

export default DOMPicker
