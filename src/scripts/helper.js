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
    document.execCommand('insertImage', null, imageURL)
  }
}

// Returns the current selection
export const copyToHTML = (target) => {
  navigator.clipboard.writeText(target.innerHTML.trim())
}

// Sets the given text as active selection
export const downloadPDF = (editor) => {
  // var HTML_Width = 800
  // var HTML_Height = 480
  // var top_left_margin = 15
  // var PDF_Width = HTML_Width + top_left_margin * 2
  // var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2
  // var canvas_image_width = HTML_Width
  // var canvas_image_height = HTML_Height

  // var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1

  html2canvas(editor, {
    width: window.innerWidth,
    height: window.innerHeight,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  }).then(function (canvas) {
    var imgData = canvas.toDataURL('image/jpeg', 1.0)
    // console.log(imgData)
    // var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height])
    // pdf.addImage(
    //   imgData,
    //   'JPG',
    //   top_left_margin,
    //   top_left_margin,
    //   canvas_image_width,
    //   canvas_image_height
    // )
    // for (var i = 1; i <= totalPDFPages; i++) {
    //   pdf.addPage(PDF_Width, PDF_Height)
    //   pdf.addImage(
    //     imgData,
    //     'JPG',
    //     top_left_margin,
    //     -(PDF_Height * i) + top_left_margin * 4,
    //     canvas_image_width,
    //     canvas_image_height
    //   )
    // }
    // pdf.save('Your_PDF_Name.pdf')
  })
}
