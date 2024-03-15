// Require discord.js
const { Client, Events, GatewayIntentBits } = require('discord.js');

const tokens = [
	process.env.DISCORD_KITTY_TOKEN,
	process.env.DISCORD_DOGGO_TOKEN,
	process.env.DISCORD_BUNNO_TOKEN
];

for (const token of tokens) {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers
		]
	});

	client.once(Events.ClientReady, readyClient => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	client.login(token);
}
