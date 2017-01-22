const {BrowserWindow} = require('electron');
const os = require('os');

const isMac = os.platform() === 'darwin';

const winOption = {
	width: 1100,
	height: 768,
	minWidth: 522,
	minHeight: 400,
	frame: isMac
}

function createWindow (opts={}) {
	const win = new BrowserWindow(
		Object.assign({}, winOption, {titleBarStyle: 'hidden'})
	);

	if (opts.hasOwnProperty('url')) {
		win.loadURL(opts.url)
	}

	return win;
}

module.exports = {
	createWindow
};
