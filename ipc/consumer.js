const {BrowserWindow, shell} = require('electron')

const { createWindow } = require('../window')
const { getServerUrl } = require('../utils')

const url = require('url')
const fetch = require('node-fetch')
const semver = require('semver')

function sendToWebContent (event) {
  const win = BrowserWindow.getFocusedWindow()
  const webContent = win && win.webContents
  if (webContent) {
    webContent.send(event)
  }
}

module.exports = function (commandId, args = {}) {
  switch (commandId) {
    case 'createWindow':
      createWindow(args)
      break
    case 'refreshWindow':
      sendToWebContent('web:refresh')
      break
    case 'learnMore':
      shell.openExternal('https://hackmd.io')
      break
    case 'goForward':
      sendToWebContent('web:go-forward')
      break
    case 'goBack':
      sendToWebContent('web:go-back')
      break
    case 'configServerUrl':
      sendToWebContent('config-serverurl')
      break
    case 'openFromUrl':
      sendToWebContent('open-from-url')
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
      sendToWebContent('copy-url')
      break
    case 'toggleSearch':
      sendToWebContent('toggle-search')
      break
    default:
      break
  }
}
