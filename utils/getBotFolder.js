const path = require('path');
const { bots } = require('../config.json');

module.exports = (targetId) => {
	botsPath = path.join(__dirname, '..', 'bots');

	const bot = bots.find(
		(b) => b.clientId === targetId
	);

	botFolder = path.join(botsPath, bot.name);

	return botFolder;

};
