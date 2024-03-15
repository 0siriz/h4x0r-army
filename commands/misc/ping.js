const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Replies with the bot ping!',
	
	callback: async (client, interaction) => {
		await interaction.deferReply();

		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		const pongEmbed = new EmbedBuilder()
			.setColor(interaction.member.guild.members.me.displayHexColor)
			.setTitle('Pong!')
			.addFields(
				{ name: 'Client ping', value: `${ping}ms` },
				{ name: 'Websocket ping', value: `${client.ws.ping}ms` }
			)

		interaction.editReply({ embeds: [pongEmbed] });
	}
};
