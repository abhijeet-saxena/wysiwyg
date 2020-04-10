// Imports
import svgMap from './scripts/svg-map.js'
import {
  alignContent,
  setColor,
  getRange,
  saveRange,
} from './scripts/helper.js'

// Variables
// DOM Selectors
const editor = document.querySelector('.editor')
const toolbar = document.querySelector('.toolbar')

// Used to store the selected text
let selectedText = null
let currentElement = null

window.onload = () => {
  // Draws all toolbar buttons
  Object.keys(svgMap).forEach((svg) => (toolbar.innerHTML += svgMap[svg]))

  const urlForm = document.querySelector('.url-form')
  const colorForm = document.querySelector('.color-form')
  const highlightColorForm = document.querySelector('.highlight-color-form')

  const resetForms = () => {
    urlForm.classList.add('hide')
    colorForm.classList.add('hide')
    highlightColorForm.classList.add('hide')
  }

  // Set default styles
  document.execCommand('styleWithCSS', false, 'true')
  document.execCommand('justifyLeft', null, null)
  alignContent('align', 'justifyLeft')

  editor.addEventListener('click', (event) => {
    Object.keys(svgMap).forEach((svg) => {
      const button = document.querySelector(`[data-command="${svg}"]`)
      let isActive = false

      if (svg !== 'createLink')
        isActive = document.queryCommandState(svg) ? true : false
      else {
        isActive = event.path.some((item) => item.tagName === 'A')
          ? true
          : false
      }

      if (isActive) button.classList.add('active')
      else button.classList.remove('active')
    })
  })

  toolbar.addEventListener('click', (event) => {
    const {
      target,
      target: {
        dataset: { command, type },
      },
    } = event
    let param = null

    if (target.tagName !== 'BUTTON') return

    if (command !== 'createLink') resetForms()

    if (!target.classList.contains('active')) {
      target.style.animation = 'clicked 200ms ease-in-out'
      target.onanimationend = () => (target.style.animation = '')
    }

    if (type === 'align' || type === 'list') alignContent(type, command)
    else if (command === 'foreColor' || command === 'backColor') {
      selectedText = saveRange()

      command === 'foreColor'
        ? colorForm.classList.remove('hide')
        : highlightColorForm.classList.remove('hide')

      return
    } else if (command === 'createLink') {
      if (window.getSelection().toString()) {
        selectedText = saveRange()
        urlForm.classList.toggle('hide')
      }
      return
    } else if (type !== 'once') target.classList.toggle('active')

    document.execCommand(command, null, param)
  })

  urlForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const url = document.querySelector('#url').value.trim()
    urlForm.classList.toggle('hide')

    if (url) {
      console.log(getRange(selectedText))
      document.execCommand('createLink', null, url)
      // document.getSelection().anchorNode.parentElement.target = '_blank'
    }
  })

  colorForm.addEventListener('click', (event) => setColor(event, 'foreColor'))
  highlightColorForm.addEventListener('click', (event) =>
    setColor(event, 'backColor')
  )
}
