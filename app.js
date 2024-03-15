const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const { bots } = require('./config.json');

const botClients = new Map()

for (const bot of bots) {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent
		]
	});

	botClients.set(bot.name, client);
	
	eventHandler(client, bot.clientId);
	
	client.login(bot.token);
}
