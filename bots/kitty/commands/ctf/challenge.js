const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

const Categories = {
	Web: 'web',
	Pwn: 'pwn',
	Crypto: 'crypto',
	Forensics: 'forensics',
	Rev: 'rev',
	Misc: 'misc',
	Other: 'other'
}

module.exports = {
	name: 'challenge',
	description: 'Handles ctf challenges',
	options: [
		{
			name: 'add',
			description: 'Adds a new challenge',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'category',
					description: 'Category of challenge',
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: 'Web', value: Categories.Web},
						{ name: 'Pwn', value: Categories.Pwn},
						{ name: 'Crypto', value:  Categories.Crypto},
						{ name: 'Forensics', value:  Categories.Forensics},
						{ name: 'Rev', value:  Categories.Rev},
						{ name: 'Misc', value:  Categories.Misc},
						{ name: 'Other', value:  Categories.Other}
					],
					required: true
				},
				{
					name: 'name',
					description: 'Name of the challenge',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
		{
			name: 'done',
			description: 'Marks challenge complete',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'credit',
					description: 'Credit some other people',
					type: ApplicationCommandOptionType.String,
					required: false
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
