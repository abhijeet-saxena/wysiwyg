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
  generateHelp,
} from './scripts/helper.js'

// Variables & DOM Selectors
const editor = document.querySelector('.editor')
const toolbar = document.querySelector('.toolbar')

// Used to store the selected text
let selectedText = null

window.onload = () => {
  // Draws all toolbar buttons
  Object.keys(svgMap).forEach((svg) => (toolbar.innerHTML += svgMap[svg]))

  generateHelp()

  editor.setAttribute(
    'data-count',
    `${editor.innerText.split(' ').length} Words | ${
      editor.innerText.length
    } Characters`
  )

  // DOM selectors for all user input forms
  const urlForm = document.querySelector('.url-form')
  const imageForm = document.querySelector('.image-form')
  const colorForm = document.querySelector('.color-form')
  const highlightForm = document.querySelector('.highlight-color-form')
  const headingForm = document.querySelector('.heading-form')
  const fontsDropDown = document.querySelector('#fonts')
  const imageInput = document.querySelector('#image')
  const urlFormInput = document.querySelector('#url')
  const helperBlock = document.querySelector('.help-overlay')

  const resetForms = () => {
    urlForm.classList.add('hide')
    imageForm.classList.add('hide')
    colorForm.classList.add('hide')
    highlightForm.classList.add('hide')
    headingForm.classList.add('hide')
  }

  const checkKeyboardShortcut = (event) => {
    const { keyCode, metaKey, shiftKey } = event
    if (!metaKey) return false
    switch (keyCode) {
      case 85: // Shortcut for Underline (Cmd+U)
        document.execCommand('underline', false, null)
        return true
      case 221: // Shortcut for Indent (Cmd+[)
        document.execCommand('indent', false, null)
        return true
      case 219: // Shortcut for Outdent (Cmd+])
        document.execCommand('outdent', false, null)
        return true
      case 75: // Shortcut for Adding Image (Cmd+K)
        selectedText = saveRange()
        imageForm.classList.toggle('hide')
        imageInput.focus()
        return true
      case 76: // Shortcut for Adding/Remove Link (Cmd+L)
        if (shiftKey) {
          document.execCommand('unlink')
        } else {
          if (window.getSelection().toString()) {
            selectedText = saveRange()
            urlForm.classList.toggle('hide')
          }
          urlFormInput.focus()
        }
        return true
      case 70: // Shortcut for Going Fullscreen (Cmd+Shift+F)
        if (shiftKey) {
          document.querySelector('.fullscreen').requestFullscreen()
          return true
        }
      default:
        return false
    }
  }

  // Set default styles
  document.execCommand('styleWithCSS', false, 'true')
  document.execCommand('justifyLeft', false, null)
  document.execCommand('defaultParagraphSeparator', false, 'br')
  alignContent('align', 'justifyLeft')

  fontsDropDown.addEventListener('change', (event) => {
    document.execCommand('fontName', false, event.target.value)
    return
  })

  document.body.addEventListener('click', (event) => {
    if (!event.path.some((item) => item.tagName === 'MAIN')) resetForms()
  })

  editor.addEventListener('click', (event) => {
    let selectedFontIndex = 0
    if (event.target.style.fontFamily) {
      Array.from(fontsDropDown.options).forEach((item, index) => {
        if (item.value === event.target.style.fontFamily)
          selectedFontIndex = index
      })
    }
    fontsDropDown.options[selectedFontIndex].selected = true

    Object.keys(svgMap).forEach((svg) => {
      resetForms()
      const button = document.querySelector(`[data-command="${svg}"]`)
      let isActive = false

      if (svg === 'createLink') {
        isActive = event.path[0].tagName === 'A' ? true : false
        if (event.metaKey) window.open(event.path[0].href)
      } else if (svg === 'insertImage') {
        isActive = event.path[0].tagName === 'IMG' ? true : false
      } else {
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
    else if (type !== 'once') target.classList.toggle('active')

    switch (command) {
      case 'foreColor':
      case 'backColor':
        selectedText = saveRange()
        command === 'foreColor'
          ? colorForm.classList.remove('hide')
          : highlightForm.classList.remove('hide')
        return
      case 'createLink':
        if (window.getSelection().toString()) {
          selectedText = saveRange()
          urlForm.classList.toggle('hide')
        }
        urlFormInput.focus()
        return
      case 'insertImage':
        selectedText = saveRange()
        imageForm.classList.toggle('hide')
        imageInput.focus()
        return
      case 'heading':
        headingForm.classList.remove('hide')
        return
      case 'copyHTML':
        editor.focus()
        document.execCommand('selectAll', false, null)
        copyToHTML(editor)
        break
      case 'codeBlock':
        formatBlock(event, '')
        editor.innerHTML += `<p><br></p>`
        editor.addEventListener('keydown', (e) => {
          if (e.keyCode === 13) {
            e.preventDefault()
            document.execCommand('insertLineBreak')
          }
        })
        return
      case 'downloadPDF':
        downloadPDF(editor)
        break
      case 'selectAll':
        editor.focus()
        break
      case 'fullScreen':
        document.querySelector('.fullscreen').requestFullscreen()
        return
      case 'help':
        helperBlock.classList.remove('hide')
        return
    }

    document.execCommand(command, false, param)
  })

  urlForm.addEventListener('submit', (e) => createLink(e, selectedText))
  imageForm.addEventListener('submit', (e) => insertImage(e, selectedText))
  colorForm.addEventListener('click', (e) => setColor(e, 'foreColor'))
  highlightForm.addEventListener('click', (e) => setColor(e, 'backColor'))
  headingForm.addEventListener('click', (e) => formatBlock(e, 'heading-form'))

  // This event listener will hide the help block
  helperBlock.addEventListener('click', (e) => {
    if (e.target.classList.contains('help-overlay'))
      helperBlock.classList.add('hide')
  })
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27 && !helperBlock.classList.contains('hide')) {
      helperBlock.classList.add('hide')
    }
  })

  editor.addEventListener('keydown', (e) => {
    editor.setAttribute(
      'data-count',
      `${editor.innerText.split(' ').length} Words | ${
        editor.innerText.length + 1
      } Characters`
    )

    // Checking For custom shortcuts
    if (checkKeyboardShortcut(e)) event.preventDefault()
  })
}
