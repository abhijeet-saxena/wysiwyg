// Returns the current selection
export const saveRange = () => {
  const selection = window.getSelection()
  if (selection.getRangeAt && selection.rangeCount)
    return selection.getRangeAt(0)
}

// Sets the given text as active selection
export const getRange = (range) => {
  if (range) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

// Handles all align operations
export const alignContent = (type, command) => {
  document
    .querySelectorAll(`.${type}`)
    .forEach((button) => button.classList.remove('active'))

  if (type === 'align' || !document.queryCommandState(command))
    document.querySelector(`[data-command=${command}]`).classList.add('active')
}

// Used for setting font color and highlight color
export const setColor = (event, command) => {
  if (event.target.tagName === 'SPAN')
    document.execCommand(command, null, event.target.dataset.color)
}

// Used for setting font color and highlight color
export const formatBlock = (event, type) => {
  document.execCommand('formatBlock', null, event.target.dataset.type)
  if (type) {
    document.querySelector(`.${type}`).classList.add('hide')
  }
}

// Used for creating link
export const createLink = (event, selectedText) => {
  event.preventDefault()

  const url = document.querySelector('#url').value.trim()
  document.querySelector('.url-form').classList.toggle('hide')

  if (url) {
    getRange(selectedText)
    document.execCommand('createLink', null, url)
    // document.getSelection().anchorNode.parentElement.target = '_blank'
  }
}

// Used for Inserting Image
export const insertImage = (event, selectedText) => {
  event.preventDefault()

  const imageURL = document.querySelector('#image').value.trim()
  document.querySelector('.image-form').classList.toggle('hide')

  if (imageURL) {
    getRange(selectedText)
    document.execCommand(
      'insertHTML',
      null,
      `<div class="editor-img-container"><img style="width:100%; height:100%" src="${imageURL}"></img></div>`
    )
  }
  document.querySelector('#image').value = ''
}

// Returns the current selection
export const copyToHTML = (target) => {
  if (document.querySelector('pre')) {
    document.querySelector('pre').style.cssText = `
      background: rgba(30, 30, 30, 1);
      color: white;
      padding: 1rem;
      margin: 5px 0rem;
      border-radius: 5px
    `
  }

  navigator.clipboard.writeText(target.innerHTML.trim())
}

// Sets the given text as active selection
export const downloadPDF = (editor) => {
  editor.classList.add('pdf')
  html2canvas(editor, {
    scale: 1,
    allowTaint: true,
    useCORS: true,
  }).then(function (canvas) {
    var imgData = canvas.toDataURL('image/png', 1.0)
    let pdf = new jsPDF('portrait', 'mm', 'a4')
    pdf.addImage(imgData, 'PNG', 5, 20)
    pdf.save('File.pdf')
  })
  editor.classList.remove('pdf')
}
