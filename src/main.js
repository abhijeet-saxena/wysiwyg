// Imports
import svgMap from './scripts/svg-map.js'

// Variables
const editor = document.querySelector('.editor')
const toolbar = document.querySelector('.toolbar')
let range = null // Used to store the selected text

const alignContent = (command) => {
  document
    .querySelectorAll('.align')
    .forEach((button) => button.classList.remove('active'))
  document.querySelector(`[data-command=${command}]`).classList.add('active')
}

window.onload = () => {
  // Draws all toolbar buttons
  Object.keys(svgMap).forEach((svg) => (toolbar.innerHTML += svgMap[svg]))

  // Set default styles
  document.execCommand('justifyLeft', null, null)
  alignContent('justifyLeft')

  const urlForm = document.querySelector('.url-form')
  const saveRange = () => {
    const selection = window.getSelection()
    if (selection.getRangeAt && selection.rangeCount)
      range = selection.getRangeAt(0)
  }

  const getRange = () => {
    if (range) {
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  editor.addEventListener(
    'selectstart',
    (event) => {
      const button = document.querySelector(`[data-command="createLink"]`)

      if (event.path.some((item) => item.tagName === 'A'))
        button.classList.add('active')
      else button.classList.remove('active')
    },
    false
  )

  editor.addEventListener(
    'mouseup',
    () => {
      Object.keys(svgMap).forEach((svg) => {
        if (svg !== 'createLink') {
          const button = document.querySelector(`[data-command="${svg}"]`)
          if (document.queryCommandState(svg)) button.classList.add('active')
          else button.classList.remove('active')
        }
      })
    },
    false
  )

  toolbar.addEventListener(
    'click',
    (event) => {
      const {
        target,
        target: {
          dataset: { command, type },
        },
      } = event
      let param = null

      if (target.tagName !== 'BUTTON') return

      if (!target.classList.contains('active')) {
        target.style.animation = 'clicked 200ms ease-in-out'
        target.onanimationend = () => (target.style.animation = '')
      }

      if (type === 'align') alignContent(command)
      else if (command === 'createLink') {
        saveRange()
        urlForm.style.display = 'flex'
        return
      } else if (type !== 'once') target.classList.toggle('active')

      document.execCommand(command, null, param)
    },
    false
  )

  urlForm.addEventListener(
    'submit',
    (event) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      var url = formData.get('url')
      getRange()
      urlForm.style.display = 'none'
      document.execCommand('createLink', null, url)
    },
    false
  )
}
