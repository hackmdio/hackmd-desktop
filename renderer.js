const { ipcRenderer, remote, clipboard } = require('electron');
const { BrowserWindow } = remote;

const fs = remote.require('fs');
const os = remote.require('os');
const path = remote.require('path');

const ipcClient = require('./ipc/client');

const menu = require('./menu');

const SERVER_URL = 'https://hackmd.io';

const isMac = os.platform() === 'darwin';

onload = () => {
	/* inject mac specific styles */
	if (isMac) {
		document.querySelector('navbar').style.paddingLeft = '75px';
		document.querySelector('#navbar-container .control-buttons:nth-child(3)').style.display = 'none';
		document.querySelector('#navbar-container .more-menu').style.display = 'none';
	}

	if (window.location.search !== '') {
		targetURL = window.location.search.match(/\?target=([^?]+)/)[1];
	} else {
		targetURL = SERVER_URL;
	}

	document.body.innerHTML += `<webview src="${targetURL}" id="main-window" disablewebsecurity autosize="on" allowpopups allowfileaccessfromfiles></webview>`;

	const webview = document.getElementById("main-window");

	webview.addEventListener('dom-ready', function(){
		// set webview title
		document.querySelector('#navbar-container .title').innerHTML = webview.getTitle();
		document.querySelector('title').innerHTML = webview.getTitle();

		// set dark theme if in home page
		if (webview.getURL().split('?')[0].split('#')[0].match(/https:\/\/hackmd.io\/$/)) {
			document.querySelector('navbar').className = 'dark';
		} else {
			document.querySelector('navbar').className = '';
		}

		/* bind control buttons event */
		document.querySelector('#navbar-container .navigate-back').onclick = () => {
			if (webview.canGoBack()) {
				webview.goBack();
			}
		};

		document.querySelector('#navbar-container .navigate-foward').onclick = () => {
			if (webview.canGoForward()) {
				webview.goForward();
			}
		};

		document.querySelector('#navbar-container .home').onclick = () => {
			webview.loadURL(SERVER_URL);
		}

		document.querySelector('#navbar-container .refresh').onclick = () => {
			webview.loadURL(webview.getURL());
		}

		document.querySelector('#navbar-container .title').onclick = () => {
			clipboard.writeText(webview.getURL());
			new Notification('URL copied', { title: 'URL copied', body: webview.getURL() });
		}

		document.querySelector('#navbar-container .more-menu').onclick = () => {
			menu.popup(require('electron').remote.getCurrentWindow());
		}

		document.querySelector('#navbar-container .minimize-window').onclick = () => {
			const win = BrowserWindow.getFocusedWindow();
			win.minimize();
		}

		document.querySelector('#navbar-container .toggle-window').onclick = () => {
			const win = BrowserWindow.getFocusedWindow();
			if (win.isMaximized()) {
				win.unmaximize();
			} else {
				win.maximize();
			}
		}

		document.querySelector('#navbar-container .close-window').onclick = () => {
			const win = BrowserWindow.getFocusedWindow();
			win.close();
		}

		// webview.openDevTools();
	});

	/* handle ipc actions */
	ipcRenderer.on('web:refresh', (event, message) => {
		webview.loadURL(webview.getURL());
	});

	/* handle _target=blank pages */
	webview.addEventListener('new-window', (event) => {
		ipcClient('createWindow', { url: `file://${path.join(__dirname, `index.html?target=${event.url}`)}` });
	});
}
