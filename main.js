const { app, BrowserWindow } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

let mainWin;

const winOption = {
	width: 1024,
	height: 768
}

const isDarwin = os.platform() === 'darwin';

function initializeApp () {
	mainWin = new BrowserWindow(
		(isDarwin
			? Object.assign({}, winOption, {titleBarStyle: 'hidden'})
			: winOption)
	);

	mainWin.loadURL(`file://${path.join(__dirname, 'index.html')}`);
}

app.on('ready', () => {
	initializeApp();
});
