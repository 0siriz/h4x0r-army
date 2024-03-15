const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = () => {
	botsPath = path.join(__dirname, '..', 'bots');
	botFolders = getAllFiles(botsPath, true);
	return botFolders;
};
