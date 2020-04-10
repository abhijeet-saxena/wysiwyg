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
