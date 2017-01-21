const { app, BrowserWindow } = require('electron');
const os = require('os');
const fs = require('fs');

let mainWin;

const winOption = {
	width: 1024,
	height: 768,
	webPreferences: {
		webSecurity: false,
		nodeIntegration: false
	}
}

const isDarwin = os.platform() === 'darwin';

function initializeApp () {
	mainWin = new BrowserWindow(
		(isDarwin
			? Object.assign({}, winOption, {titleBarStyle: 'hidden-inset'})
			: winOption)
	);

	if (process.env.NODE_ENV === 'development') {
		mainWin.loadURL('http://localhost:3000');
	} else {
		mainWin.loadURL('https://hackmd.io');
	}

	mainWin.webContents.on('did-finish-load', function() {
		let cssPath = isDarwin ? '/static/darwin.css' : '/static/app.css';

		fs.readFile(__dirname + cssPath, 'utf-8', function(error, data) {
			if (!error) {
				mainWin.webContents.insertCSS(data);
			}
		});
	});
}

app.on('ready', () => {
	initializeApp();
});
