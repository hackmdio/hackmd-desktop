const { ipcRenderer } = require('electron')

module.exports = function (commandId, args) {
  ipcRenderer.send('main:command', { commandId, args })
}
