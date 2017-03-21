const Config = require('electron-config');
const config = new Config();

const getServerUrl = () => config.get('serverurl') || 'https://hackmd.io';

module.exports = {
	getServerUrl
}
