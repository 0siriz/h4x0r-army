const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const getCategory = require('../../../../utils/getCategory');
const createChannel = require('../../../../utils/createChannel');
const Guild = require('../../../../models/Guild');
const { ctfActiveName, ctfArchivePrefix, ctfActiveChallengeName, ctfCompletedChallengeName } = require('../../../../config.json');

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
		const guildObj = interaction.member.guild;
		const guild = await Guild.findOne({ guildId: guildObj.id });

		if (!guild) {
			interaction.reply({ content: 'Guild is not initialized', ephemeral: true });
			return;
		}

		if (interaction.options.getSubcommand() == 'add') {
			const ctfRoleId = guild.ctfRoleId;
			const name = interaction.options.getString('name').replaceAll(' ', '');
			const createdCtf = await createChannel(guildObj, name, ctfActiveName, [ctfRoleId]);
			interaction.reply(`CTF added: <#${createdCtf.id}>`);
		} else if (interaction.options.getSubcommand() == "done") {
			const activeCtfCategory = await getCategory(guildObj, ctfActiveName);
			const ctfChannel = guildObj.channels.cache.find((c) => c.id == interaction.channelId && c.parentId === activeCtfCategory.id);
			if (ctfChannel === undefined) {
				interaction.reply({ content: `This command must be called from a CTF Channel`, ephemeral: true });
				return;
			}

			const archiveCategory = await getCategory(guildObj, `${ctfArchivePrefix} - ${ctfChannel.name}`);

			ctfChannel.setParent(archiveCategory, {lockPermissions: false})
			
			const activeChallengeCategory = await getCategory(guildObj, ctfActiveChallengeName);
			const completedChallengeCategory = await getCategory(guildObj, ctfCompletedChallengeName);

			const challengeChannels = guildObj.channels.cache.filter((c) => c.name.split('_')[0] === ctfChannel.name &&
					(c.parentId == activeChallengeCategory.id || c.parentId == completedChallengeCategory.id));

			challengeChannels.forEach((c) => {
				c.setParent(archiveCategory, {lockPermissions: false});
				c.send(`**Challenge has been archived**`);
			});

			interaction.reply(`**CTF has been archived**`);

		} else {
			interaction.reply({ content: `Unknown subcommmand ${interaction.options.getSubcommand()}`, ephemeral: true });
		}
	}
};
