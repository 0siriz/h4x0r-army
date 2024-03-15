const { Events } = require('discord.js');
const { mockList } = require('../config.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (mockList.includes(message.author.id)) {
			message.reply(message.content.toLowerCase()
				.split('')
				.map((c) => {
					return Math.random() < .5 ? c : c.toUpperCase();}
				).join(''));
		}
	}
};
