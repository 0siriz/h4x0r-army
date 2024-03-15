const { Events } = require('discord.js');
const { mockChannelId, botConfigs } = require('../config.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// Dont reply to ourselves
		for (const botConfig of botConfigs) {
			if (message.author.id === botConfig.clientId) {
				return
			}
		}

		if (message.channelId === mockChannelId) {
			message.reply(message.content.toLowerCase()
				.split('')
				.map((c) => {
					return Math.random() < .5 ? c : c.toUpperCase();}
				).join(''));
		}
	}
};
