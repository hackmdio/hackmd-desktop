const fs = require('electron').remote.require('fs');
const os = require('electron').remote.require('os');
const path = require('electron').remote.require('path');
const {ipcRenderer} = require('electron');
const {BrowserWindow} = require('electron').remote;
const {clipboard} = require('electron');

const SERVER_URL = 'https://hackmd.io';

const isDarwin = os.platform() === 'darwin';

const winOption = {
	width: 1024,
	height: 768
}

onload = () => {
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

		// webview.openDevTools();
	});

	/* handle ipc actions */
	ipcRenderer.on('web:refresh', (event, message) => {
		webview.loadURL(webview.getURL());
	});

	/* handle _target=blank pages */
	webview.addEventListener('new-window', (event) => {
		new BrowserWindow(
			(isDarwin
				? Object.assign({}, winOption, {titleBarStyle: 'hidden'})
				: winOption)
		).loadURL(`file://${path.join(__dirname, `index.html?target=${event.url}`)}`);
	});
}
