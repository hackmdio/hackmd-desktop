const { ipcMain, ipcRenderer } = require('electron');
const consumer = require('./ipc/consumer');

const Menu = require('electron').Menu || require('electron').remote.Menu;
const app = require('electron').app || require('electron').remote.app;
const path = require('path') || require('electron').remote.require('path');
const os = require('os') || require('electron').remote.require('os');

const isMainProcess = typeof ipcMain !== 'undefined';

function exec(commandId, args={}) {
  if (isMainProcess) {
    consumer(commandId, args);
  } else {
    ipcRenderer.send('main:command', { commandId, args });
  }
}

const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New File',
				accelerator: 'CmdOrCtrl+N',
				click () {
          exec('createWindow', {url: `file://${path.join(__dirname, 'index.html?target=https://hackmd.io/new')}`})
				}
			},
			{
				label: 'New Window',
				accelerator: 'CmdOrCtrl+Shift+N',
				click () {
          exec('createWindow', {url: `file://${path.join(__dirname, 'index.html')}`})
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
				label: 'Refresh',
				accelerator: 'CmdOrCtrl+R',
				click () {
          exec('refreshWindow');
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
      },
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () {
          exec('learnMore');
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

module.exports = Menu.buildFromTemplate(template);
