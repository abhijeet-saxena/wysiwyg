export const alignContent = (command) => {
  document
    .querySelectorAll('.align')
    .forEach((button) => button.classList.remove('active'))
  document.querySelector(`[data-command=${command}]`).classList.add('active')
}

export const saveRange = () => {
  const selection = window.getSelection()
  if (selection.getRangeAt && selection.rangeCount)
    return selection.getRangeAt(0)
}

export const getRange = (range) => {
  if (range) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
