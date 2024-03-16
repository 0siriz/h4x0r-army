const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const createChannel = require('../../../../utils/createChannel');
const { ctfActiveName, ctfPlayerRoleId } = require('../../../../config.json');

module.exports = {
	name: 'ctf',
	description: 'Handle CTFs',
	options: [
		{
			name: 'add',
			description: 'Add a CTF',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "name",
					description: "Name of the CTF",
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		}
	],
	
	callback: async (client, interaction) => {
		await interaction.deferReply();

		if (interaction.options.getSubcommand() == 'add') {
			const name = interaction.options.getString('name');
			await createChannel(interaction.member.guild, name, ctfActiveName, [ctfPlayerRoleId]);
			interaction.editReply(`CTF added: ${name}`);
		} else {
			interaction.editReply(`Unknown subcommmand ${interaction.options.getSubcommand()}`);
		}
	}
};
