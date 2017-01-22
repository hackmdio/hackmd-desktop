const {BrowserWindow} = require('electron');
const os = require('os');

const winOption = {
	width: 1100,
	height: 768,
	minWidth: 522,
	minHeight: 400
}

const isDarwin = os.platform() === 'darwin';

function createWindow (opts={}) {
	const win = new BrowserWindow(
		(isDarwin
			? Object.assign({}, winOption, {titleBarStyle: 'hidden'})
			: winOption)
	);

	if (opts.hasOwnProperty('url')) {
		win.loadURL(opts.url)
	}

	return win;
}

module.exports = {
	createWindow
};
