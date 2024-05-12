const { ApplicationCommandOptionType } = require('discord.js');
const Guild = require('../../../../models/Guild');

module.exports = {
	name: 'guildmanage',
	description: 'Manage the guild',
	options: [
		{
			name: 'init',
			description: 'Initialize the guild',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'ctf-role',
					description: 'The role that ctf players have',
					type: ApplicationCommandOptionType.Role,
					required: true
				},
			]
		}
	],
	
	callback: async (client, interaction) => {
		const guild = interaction.member.guild;
		let guildModel = await Guild.findOne({ guildId: guild.id });

		if (interaction.options.getSubcommand() === 'init') {
			if (guildModel) {
				interaction.reply({ content: `Guild has already been initialized`, ephemeral: true });
			} else {
				guildModel = new Guild({
					guildId: guild.id,
					ctfRoleId: interaction.options.getRole('ctf-role').id
				});
				await guildModel.save();
				interaction.reply({ content: `Initialized Guild`, ephemeral: true });
			}
		} else {
			interaction.reply({ content: `Unknown subcommand ${interaction.options.getSubcommand()}`, ephemeral: true });
		}
	}
};
