const {app, Menu, BrowserWindow, shell} = require('electron');
const path = require('path');

const { createWindow } = require('../window');

module.exports = function(commandId, args={}) {
  switch(commandId) {
    case 'createWindow':
      createWindow(args);
      break;
    case 'refreshWindow':
		  BrowserWindow.getFocusedWindow().webContents.send('web:refresh');
      break;
    case 'learnMore':
      shell.openExternal('https://hackmd.io');
      break;
		case 'goForward':
		  BrowserWindow.getFocusedWindow().webContents.send('web:go-forward');
      break;
		case 'goBack':
		  BrowserWindow.getFocusedWindow().webContents.send('web:go-back');
      break;
    default:
      break;
  }
}
