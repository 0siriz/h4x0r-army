const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const getAllFiles = require('./utils/getAllFiles');
const getBotFolders = require('./utils/getBotFolders');

const botClients = new Map()

const botFolders = getBotFolders();

for (const botFolder of botFolders) {
	const botName = botFolder.replace(/\\/g, '/').split('/').pop();
	const filePath = path.join(botFolder, 'config.json');
	const { token, clientId } = require(filePath);


	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent
		]
	});

	botClients.set(botName, client);
	
	eventHandler(client, clientId);
	
	client.login(token);
}
