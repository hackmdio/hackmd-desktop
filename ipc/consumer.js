const {app, Menu, BrowserWindow, shell} = require('electron');
const path = require('path');

const { createWindow } = require('../window');

module.exports = function(commandId, args={}) {
  switch(commandId) {
    case 'createWindow':
      createWindow(args);
      break;
    case 'refreshWindow':
		  const win = BrowserWindow.getFocusedWindow();
			win.webContents.send('web:refresh');
      break;      
    case 'learnMore':
      shell.openExternal('https://hackmd.io');
      break;
    default:
      break;
  }
}
