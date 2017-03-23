const { ipcMain, ipcRenderer } = require('electron')

const consumer = require('./consumer')

const isMainProcess = typeof ipcMain !== 'undefined'

const exec = (commandId, args = {}) => {
  if (isMainProcess) {
    consumer(commandId, args)
  } else {
    ipcRenderer.send('main:command', { commandId, args })
  }
}

module.exports = exec
