const {BrowserWindow, shell} = require('electron')

const { createWindow } = require('../window')
const { getServerUrl } = require('../utils')

const url = require('url')
const fetch = require('node-fetch')
const semver = require('semver')

module.exports = function (commandId, args = {}) {
  switch (commandId) {
    case 'createWindow':
      createWindow(args)
      break
    case 'refreshWindow':
      BrowserWindow.getFocusedWindow().webContents.send('web:refresh')
      break
    case 'learnMore':
      shell.openExternal('https://hackmd.io')
      break
    case 'goForward':
      BrowserWindow.getFocusedWindow().webContents.send('web:go-forward')
      break
    case 'goBack':
      BrowserWindow.getFocusedWindow().webContents.send('web:go-back')
      break
    case 'configServerUrl':
      BrowserWindow.getFocusedWindow().webContents.send('config-serverurl')
      break
    case 'openFromUrl':
      BrowserWindow.getFocusedWindow().webContents.send('open-from-url')
      break
    case 'checkVersion':
      return fetch(url.resolve(getServerUrl(), '/status')).then(response => {
        var browserWindows = BrowserWindow.getAllWindows()
        if (!semver.satisfies(response.headers.get('HackMD-Version'), '>= 0.5.1')) {
          browserWindows.forEach(browserWindow => {
            browserWindow.send('unsupported-version')
          })
        } else {
          browserWindows.forEach(browserWindow => {
            browserWindow.send('supported-version')
          })
        }
      }).catch(err => console.log(err))
    case 'copyUrl':
      BrowserWindow.getFocusedWindow().webContents.send('copy-url')
      break
    case 'toggleSearch':
      BrowserWindow.getFocusedWindow().webContents.send('toggle-search')
      break
    default:
      break
  }
}
