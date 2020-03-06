// Imports
import svgMap from './scripts/svg-map.js'
import {
  saveRange,
  alignContent,
  setColor,
  formatBlock,
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
  const headingForm = document.querySelector('.heading-form')

  const resetForms = () => {
    urlForm.classList.add('hide')
    imageForm.classList.add('hide')
    colorForm.classList.add('hide')
    highlightForm.classList.add('hide')
    headingForm.classList.add('hide')
  }

  // Set default styles
  document.execCommand('styleWithCSS', false, 'true')
  document.execCommand('justifyLeft', false, null)
  document.execCommand('defaultParagraphSeparator', false, 'p')
  alignContent('align', 'justifyLeft')

  document.body.addEventListener('click', (event) => {
    if (!event.path.some((item) => item.tagName === 'MAIN')) resetForms()
  })

  editor.addEventListener('click', (event) => {
    Object.keys(svgMap).forEach((svg) => {
      resetForms()
      const button = document.querySelector(`[data-command="${svg}"]`)
      let isActive = false

      if (svg === 'createLink')
        isActive = event.path.some((item) => item.tagName === 'A')
          ? true
          : false
      else {
        isActive = document.queryCommandState(svg) ? true : false
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
      document.querySelector('#url').focus()
      return
    } else if (command === 'insertImage') {
      selectedText = saveRange()
      imageForm.classList.toggle('hide')
      document.querySelector('#image').focus()
      return
    } else if (command === 'heading') {
      headingForm.classList.remove('hide')
      return
    } else if (command === 'copyHTML') {
      editor.focus()
      document.execCommand('selectAll', false, null)
      copyToHTML(editor)
    } else if (command === 'codeBlock') {
      formatBlock(event, '')
      editor.innerHTML += `<p><br></p>`
      editor.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          e.preventDefault()
          document.execCommand('insertLineBreak')
        }
      })
      return
    } else if (command === 'downloadPDF') downloadPDF(editor)
    else if (type !== 'once') target.classList.toggle('active')

    document.execCommand(command, false, param)
  })

  urlForm.addEventListener('submit', (e) => createLink(e, selectedText))
  imageForm.addEventListener('submit', (e) => insertImage(e, selectedText))
  colorForm.addEventListener('click', (e) => setColor(e, 'foreColor'))
  highlightForm.addEventListener('click', (e) => setColor(e, 'backColor'))
  headingForm.addEventListener('click', (e) => formatBlock(e, 'heading-form'))
}
