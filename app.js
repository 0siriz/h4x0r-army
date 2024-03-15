const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { botConfigs } = require('./config.json');

const clients = new Map()

const commandsParentPath = path.join(__dirname, 'commands');
const eventsParentPath = path.join(__dirname, 'events');

// Make all bots
for (const botConfig of botConfigs) {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers
		],
		presence: {
			activities: [{ name: 'CTF', type: ActivityType.Competing }]
		}
	});

	clients.set(botConfig.token, client)

	client.commands = new Collection();

	const botCommandsPath = path.join(commandsParentPath, botConfig.shortName);
	const commandFolders = fs.readdirSync(botCommandsPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(botCommandsPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			};
		};
	};

	const eventFiles = fs.readdirSync(eventsParentPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsParentPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		};
	}

}

for (const [token, client] of clients) {
	client.login(token)
}
