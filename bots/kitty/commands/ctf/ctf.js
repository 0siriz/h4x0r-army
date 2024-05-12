const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const getCategory = require('../../../../utils/getCategory');
const createChannel = require('../../../../utils/createChannel');
const Guild = require('../../../../models/Guild');
const Channel = require('../../../../models/Channel');
const Ctf = require('../../../../models/Ctf');
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
		const guild = interaction.member.guild;
		const guildModel = await Guild.findOne({ guildId: guild.id });

		if (!guildModel) {
			interaction.reply({ content: 'Guild is not initialized', ephemeral: true });
			return;
		}

		if (interaction.options.getSubcommand() === 'add') {
			const ctfRoleId = guildModel.ctfRoleId;
			const name = interaction.options.getString('name').replaceAll(' ', '');

			let ctfModel = await Ctf.findOne({ ctfName: name });

			if (ctfModel) {
				const channel = await Channel.findById(ctfModel.channel);
				interaction.reply({ content: `CTF Already exists at <#${channel.channelId}>`, ephemeral: true });
			} else {
				const createdCtf = await createChannel(guild, name, ctfActiveName, [ctfRoleId]);
				const channelModel = new Channel({
					channelId: createdCtf.id,
					guild: guildModel
				});
				ctfModel = new Ctf({
					ctfName: name,
					channel: channelModel
				});
				interaction.reply(`CTF added: <#${createdCtf.id}>`);
				await channelModel.save();
				await ctfModel.save();

			}

		} else if (interaction.options.getSubcommand() === "done") {
			const channelModel = await Channel.findOne({ channelId: interaction.channelId });

			if (channelModel) {
				const ctfModel = await Ctf.findOne({ channel: channelModel._id });
				if (ctfModel) {
					const ctfChannel = guild.channels.cache.find((c) => c.id == channelModel.channelId)
					const archiveCategory = await getCategory(guild, `${ctfArchivePrefix} - ${ctfChannel.name}`);
					ctfChannel.setParent(archiveCategory, {lockPermissions: false})
			
					const activeChallengeCategory = await getCategory(guild, ctfActiveChallengeName);
					const completedChallengeCategory = await getCategory(guild, ctfCompletedChallengeName);

					const challengeChannels = guild.channels.cache.filter((c) => c.name.split('_')[0] === ctfChannel.name &&
						(c.parentId == activeChallengeCategory.id || c.parentId == completedChallengeCategory.id));

					challengeChannels.forEach((c) => {
						c.setParent(archiveCategory, {lockPermissions: false});
						c.send(`**Challenge has been archived**`);
					});

					interaction.reply(`**CTF has been archived**`);
					await ctfModel.updateOne({ done: true });
					return;
				}
			}
			
			interaction.reply({ content: `This command must be called from a CTF Channel`, ephemeral: true });

		} else {
			interaction.reply({ content: `Unknown subcommmand ${interaction.options.getSubcommand()}`, ephemeral: true });
		}
	}
};
