// const { ipcRenderer } = require('electron')

// const handleSetElementHtml = elementId => (event, html) => {
//   document.getElementById(elementId).innerHTML = html
// }

// ipcRenderer.on('selected-text', handleSetElementHtml('selected-text'))
// ipcRenderer.on('translated-text', handleSetElementHtml('translated-text'))
// ipcRenderer.on('translation-explanation', handleSetElementHtml('translation-explanation'))

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  receiveMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  }
})