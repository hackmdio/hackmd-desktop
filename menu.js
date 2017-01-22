const {app, Menu, BrowserWindow} = require('electron');
const path = require('path');
const { createWindow } = require('./window');

const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New File',
				accelerator: 'CmdOrCtrl+N',
				click () {
					createWindow({url: `file://${path.join(__dirname, 'index.html?target=https://hackmd.io/new')}`});
				}
			},
			{
				label: 'New Window',
				accelerator: 'CmdOrCtrl+Shift+N',
				click () {
					createWindow({url: `file://${path.join(__dirname, 'index.html')}`});
				}
			},
			{
				type: 'separator'
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
					const win = BrowserWindow.getFocusedWindow();
					win.webContents.send('web:refresh');
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
        click () { require('electron').shell.openExternal('https://hackmd.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
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
