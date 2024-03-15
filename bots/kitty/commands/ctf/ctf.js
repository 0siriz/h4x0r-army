const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'ctf',
	description: 'Handles ctfs',
	options: [
		{
			name: 'add',
			description: 'Adds a new CTF',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "name",
					description: "Name of CTF",
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		}
	],
	
	callback: async (client, interaction) => {
		await interaction.deferReply();

		const reply = await interaction.fetchReply();

		const ctfEmbed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle('Not Implemented')

		interaction.editReply({ embeds: [ctfEmbed] });
	}
};
