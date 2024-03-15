const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const token = process.env.DISCORD_KITTY_TOKEN

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	]
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
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

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

// Multiple Accounts for later
// const tokens = [
// 	process.env.DISCORD_KITTY_TOKEN,
// 	process.env.DISCORD_DOGGO_TOKEN,
// 	process.env.DISCORD_BUNNO_TOKEN
// ];
//
// for (const token of tokens) {
// 	const client = new Client({
// 		intents: [
// 			GatewayIntentBits.Guilds,
// 			GatewayIntentBits.GuildMessages,
// 			GatewayIntentBits.MessageContent,
// 			GatewayIntentBits.GuildMembers
// 		]
// 	});
//
// 	client.once(Events.ClientReady, readyClient => {
// 		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// 	});
//
// 	client.login(token);
// }