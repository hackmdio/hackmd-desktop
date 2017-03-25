const { ipcRenderer, remote, clipboard } = require('electron')
const { Menu } = remote

const os = remote.require('os')
const path = remote.require('path')

const Config = require('electron-config')
const config = new Config()
const validate = require('validate.js')
const ElectronSearchText = require('electron-search-text')

const ipcClient = require('./ipc/client')

const menu = require('./menu')

const { DEFAULT_SERVER_URL } = require('./constants')
const { getServerUrl } = require('./utils')

const isMac = os.platform() === 'darwin'

window.onload = () => {
  /* inject mac specific styles */
  if (isMac) {
    document.querySelector('navbar').style.paddingLeft = '75px'
    document.querySelector('#navbar-container .control-buttons:nth-child(3)').style.display = 'none'
    if (process.env.NODE_ENV !== 'development') {
      document.querySelector('#navbar-container .more-menu').style.display = 'none'
    }
  }

  let targetURL
  if (window.location.search !== '') {
    targetURL = window.location.search.match(/\?target=([^?]+)/)[1]
  } else {
    targetURL = getServerUrl()
  }

  document.body.innerHTML += `<webview src="${targetURL}" id="main-window" disablewebsecurity autosize="on" allowpopups allowfileaccessfromfiles></webview>`

  const webview = document.getElementById('main-window')

  const searcher = new ElectronSearchText({
    target: '#main-window'
  })

  function copyUrl () {
    clipboard.writeText(webview.getURL())
    new Notification('URL copied', { title: 'URL copied', body: webview.getURL() }) // eslint-disable-line no-new
  }

  const navbarMenu = Menu.buildFromTemplate([{
    label: 'Copy URL',
    click () {
      copyUrl()
    }
  }])

  webview.addEventListener('dom-ready', function () {
    // set webview title
    document.querySelector('#navbar-container .title').innerHTML = webview.getTitle()
    document.querySelector('title').innerHTML = webview.getTitle()

    // set dark theme if in home page
    if (webview.getURL().split('?')[0].split('#')[0].match(/https?:\/\/hackmd.io\/$/)) {
      $('navbar').addClass('dark')
    } else {
      $('navbar').remove('dark')
    }

    /* bind control buttons event */
    document.querySelector('#navbar-container .navigate-back').onclick = () => {
      if (webview.canGoBack()) {
        webview.goBack()
      }
    }

    document.querySelector('#navbar-container .navigate-foward').onclick = () => {
      if (webview.canGoForward()) {
        webview.goForward()
      }
    }

    document.querySelector('#navbar-container .home').onclick = () => {
      webview.loadURL(getServerUrl())
    }

    document.querySelector('#navbar-container .refresh').onclick = () => {
      webview.loadURL(webview.getURL())
    }

    document.querySelector('#navbar-container .more-menu').onclick = () => {
      menu.popup(remote.getCurrentWindow())
    }

    document.querySelector('#navbar-container .minimize-window').onclick = () => {
      const win = remote.getCurrentWindow()
      win.minimize()
    }

    document.querySelector('#navbar-container .toggle-window').onclick = () => {
      const win = remote.getCurrentWindow()
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }

    $('#navbar-container .pin-window').click(function () {
      const win = remote.getCurrentWindow()
      if (win.isAlwaysOnTop()) {
        win.setAlwaysOnTop(false)
        $(this).removeClass('pinned')
      } else {
        win.setAlwaysOnTop(true)
        $(this).addClass('pinned')
      }
    })

    document.querySelector('#navbar-container .close-window').onclick = () => {
      const win = remote.getCurrentWindow()
      win.close()
    }

    document.querySelector('#navbar-container').addEventListener('contextmenu', () => {
      navbarMenu.popup(remote.getCurrentWindow())
    })

    if (process.env.NODE_ENV === 'development') {
      webview.openDevTools()
    }
  })

  /* handle ipc actions */
  ipcRenderer.on('web:refresh', (event, message) => {
    webview.loadURL(webview.getURL())
  })

  ipcRenderer.on('web:go-foward', (event) => {
    if (webview.canGoForward()) {
      webview.goForward()
    }
  })

  ipcRenderer.on('web:go-back', (event) => {
    if (webview.canGoBack()) {
      webview.goBack()
    }
  })

  ipcRenderer.on('enter-full-screen', () => {
    document.querySelector('navbar').style.display = 'none'
  })

  ipcRenderer.on('leave-full-screen', () => {
    document.querySelector('navbar').style.display = 'inherit'
  })

  ipcRenderer.on('config-serverurl', () => {
    if (!getServerUrl().match(/https?:\/\/hackmd\.io/)) {
      $('#serverurl-config-modal.modal input[type="text"]').val(getServerUrl())
    }
    $('#serverurl-config-modal.modal').modal()
  })

  ipcRenderer.on('open-from-url', () => {
    $('#open-from-url-modal.modal').modal()
  })

  ipcRenderer.on('unsupported-version', () => {
    $('navbar').addClass('unsupported')
  })

  ipcRenderer.on('supported-version', () => {
    $('navbar').removeClass('unsupported')
  })

  ipcRenderer.on('copy-url', () => {
    copyUrl()
  })

  ipcRenderer.on('toggle-search', function () {
    searcher.emit('toggle')
  })

  $('#serverurl-config-modal.modal #submit-serverurl').click(function () {
    let serverurl = $('#serverurl-config-modal.modal input[type="text"]').val()

    // reset default
    if (serverurl.length === 0) { serverurl = DEFAULT_SERVER_URL }

    const errors = validate({ serverurl }, {serverurl: {url: { allowLocal: true }}})
    if (!errors) {
      config.set('serverurl', serverurl)
      webview.loadURL(serverurl)
      ipcClient('checkVersion')
      $('#serverurl-config-modal.modal').modal('hide')
    } else {
      // show me some error
      window.alert(errors.serverurl)
    }
  })

  $('#open-from-url-modal.modal #submit-file-url').click(function () {
    let url = $('#open-from-url-modal.modal input[type="text"]').val()
    if (url.length > 0) {
      ipcClient('createWindow', { url: `file://${path.join(__dirname, `index.html?target=${url}`)}` })
      $('#open-from-url-modal.modal').modal('hide')
    }
  })

  /* handle _target=blank pages */
  webview.addEventListener('new-window', (event) => {
    ipcClient('createWindow', { url: `file://${path.join(__dirname, `index.html?target=${event.url}`)}` })
  })

  ipcClient('checkVersion')
}
