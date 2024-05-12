const path = require('path');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const { bots, mongoDBURI } = require('./config.json');

(async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(mongoDBURI);
		console.log('Connected to the DB');
		
		const botClients = new Map()

		for (const bot of bots) {
			const client = new Client({
				intents: [
					GatewayIntentBits.Guilds,
					GatewayIntentBits.GuildMembers,
					GatewayIntentBits.GuildMessages,
					GatewayIntentBits.MessageContent
				],
				presence: {
					activities: [{ name: "CTF", type: ActivityType.Competing }]
				}
			});

			botClients.set(bot.name, client);
			
			eventHandler(client, bot.clientId);
			
			client.login(bot.token);
		}
	} catch(err) {
		console.error(`Error: ${err}`);
	}
})();
