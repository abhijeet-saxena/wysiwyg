// Imports
import svgMap from './scripts/svg-map.js'
import {
  saveRange,
  alignContent,
  setColor,
  createLink,
  insertImage,
  copyToHTML,
  downloadPDF,
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

  // DOM selectors for all user input forms
  const urlForm = document.querySelector('.url-form')
  const imageForm = document.querySelector('.image-form')
  const colorForm = document.querySelector('.color-form')
  const highlightForm = document.querySelector('.highlight-color-form')

  const resetForms = () => {
    urlForm.classList.add('hide')
    colorForm.classList.add('hide')
    highlightForm.classList.add('hide')
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
        : highlightForm.classList.remove('hide')

      return
    } else if (command === 'createLink') {
      if (window.getSelection().toString()) {
        selectedText = saveRange()
        urlForm.classList.toggle('hide')
      }
      return
    } else if (command === 'insertImage') {
      selectedText = saveRange()
      imageForm.classList.toggle('hide')
      return
    } else if (command === 'copyHTML') {
      editor.focus()
      document.execCommand('selectAll')
      copyToHTML(editor)
    } else if (command === 'downloadPDF') downloadPDF(editor)
    else if (type !== 'once') target.classList.toggle('active')

    document.execCommand(command, null, param)
  })

  urlForm.addEventListener('submit', (e) => createLink(e, selectedText))
  imageForm.addEventListener('submit', (e) => insertImage(e, selectedText))
  colorForm.addEventListener('click', (e) => setColor(e, 'foreColor'))
  highlightForm.addEventListener('click', (e) => setColor(e, 'backColor'))
}
