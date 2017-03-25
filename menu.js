const path = require('path')
const url = require('url')
const os = require('os')

const Menu = require('electron').Menu || require('electron').remote.Menu
const app = require('electron').app || require('electron').remote.app

const { getServerUrl } = require('./utils')
const exec = require('./ipc/exec')

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        click () {
          exec('createWindow', {url: `file://${path.join(__dirname, `index.html?target=${url.resolve(getServerUrl(), '/new')}`)}`})
        }
      },
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Shift+N',
        click () {
          exec('createWindow', {url: `file://${path.join(__dirname, 'index.html')}`})
        }
      },
      {
        label: 'Open from url',
        accelerator: 'CmdOrCtrl+O',
        click () {
          exec('openFromUrl')
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        label: 'Copy URL',
        click () {
          exec('copyUrl')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Search',
        accelerator: 'CmdOrCtrl+F',
        click () {
          exec('toggleSearch')
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      },
      {
        type: 'separator'
      },
      {
        label: 'Customize HackMD server',
        click () {
          exec('configServerUrl')
        }
      }
    ]
  },
  {
    label: 'History',
    submenu: [
      {
        label: 'Forward',
        accelerator: 'CmdOrCtrl+]',
        click () {
          exec('goForward')
        }
      },
      {
        label: 'Back',
        accelerator: 'CmdOrCtrl+[',
        click () {
          exec('goBack')
        }
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      },
      {
        type: 'separator'
      },
      {
        label: 'Refresh',
        accelerator: 'CmdOrCtrl+R',
        click () {
          exec('refreshWindow')
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      },
      {
        role: 'toggledevtools'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () {
          exec('learnMore')
        }
      }
    ]
  }
]

if (os.platform() === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[2].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
}

module.exports = Menu.buildFromTemplate(template)
