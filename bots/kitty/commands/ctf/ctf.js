const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const getCategory = require('../../../../utils/getCategory');
const createChannel = require('../../../../utils/createChannel');
const { ctfActiveName, ctfArchivePrefix, ctfActiveChallengeName, ctfCompletedChallengeName, ctfPlayerRoleId } = require('../../../../config.json');

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
		},
		{
			name: 'done',
			description: 'Marks CTF as over and archives it',
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
	
	callback: async (client, interaction) => {
		await interaction.deferReply();

		const guild = interaction.member.guild;

		if (interaction.options.getSubcommand() == 'add') {
			const name = interaction.options.getString('name');
			const createdCtf = await createChannel(guild, name, ctfActiveName, [ctfPlayerRoleId]);
			interaction.editReply(`CTF added: <#${createdCtf.id}>`);
		} else if (interaction.options.getSubcommand() == "done") {
			const activeCtfCategory = await getCategory(guild, ctfActiveName);
			const ctfChannel = guild.channels.cache.find((c) => c.id == interaction.channelId && c.parentId === activeCtfCategory.id);
			if (ctfChannel === undefined) {
				interaction.editReply(`This command must be called from a CTF Channel`);
				return;
			}

			const archiveCategory = await getCategory(guild, `${ctfArchivePrefix} - ${ctfChannel.name}`);

			ctfChannel.setParent(archiveCategory, {lockPermissions: false})
			
			const activeChallengeCategory = await getCategory(guild, ctfActiveChallengeName);
			const completedChallengeCategory = await getCategory(guild, ctfCompletedChallengeName);

			const challengeChannels = guild.channels.cache.filter((c) => c.name.split('_')[0] === ctfChannel.name &&
					(c.parentId == activeChallengeCategory.id || c.parentId == completedChallengeCategory.id));

			challengeChannels.forEach((c) => {
				c.setParent(archiveCategory, {lockPermissions: false});
				c.send(`Challenge has been archived`);
			});

			interaction.editReply(`CTF has been archived`);

		} else {
			interaction.editReply(`Unknown subcommmand ${interaction.options.getSubcommand()}`);
		}
	}
};
