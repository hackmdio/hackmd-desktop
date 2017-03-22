const { ipcMain } = require('electron')
const consumer = require('./consumer')

ipcMain.on('main:command', (event, { commandId, args }) => {
  consumer(commandId, args)
})
