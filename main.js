const { app, BrowserWindow, Menu } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');
const menu = require('./menu');
const { createWindow } = require('./window');

require('./ipc/server');

let mainWin;

function initializeApp () {
	Menu.setApplicationMenu(menu);

	mainWin = createWindow({url: `file://${path.join(__dirname, 'index.html')}`});
}

app.on('ready', () => {
	initializeApp();
});
