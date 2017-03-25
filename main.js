const { app, Menu } = require('electron')
const path = require('path')
const menu = require('./menu')
const { createWindow } = require('./window')

require('./ipc/server')

function initializeApp () {
  Menu.setApplicationMenu(menu)

  createWindow({url: `file://${path.join(__dirname, 'index.html')}`})
}

app.on('ready', () => {
  initializeApp()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  initializeApp()
})
