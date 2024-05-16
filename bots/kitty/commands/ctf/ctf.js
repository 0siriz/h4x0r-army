const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const getCategory = require('../../../../utils/getCategory');
const createChannel = require('../../../../utils/createChannel');
const Guild = require('../../../../models/Guild');
const Ctf = require('../../../../models/Ctf');
const Challenge = require('../../../../models/Challenge');
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

			let ctfModel = await Ctf.findOne({ name: name, guild: guildModel });

			if (ctfModel) {
				interaction.reply({ content: `CTF already exists at <#${ctfModel.channelId}>`, ephemeral: true });
				return;
			}
			
			const createdCtf = await createChannel(guild, name, ctfActiveName, [ctfRoleId]);
			ctfModel = new Ctf({
				name: name,
				channelId: createdCtf.id,
				guild: guildModel
			});
			interaction.reply(`CTF added: <#${createdCtf.id}>`);
			await ctfModel.save();


		} else if (interaction.options.getSubcommand() === "done") {
			let ctfModel = await Ctf.findOne({ channelId: interaction.channelId });

			if (!ctfModel) {
				interaction.reply({ content: `This command must be called from a CTF Channel`, ephemeral: true });
				return;
			}

			const ctfChannel = guild.channels.cache.find((c) => c.id == ctfModel.channelId)
			const archiveCategory = await getCategory(guild, `${ctfArchivePrefix} - ${ctfModel.name}`);
			ctfChannel.setParent(archiveCategory, {lockPermissions: false})

			const challenges = await Challenge.find({ ctf: ctfModel });

			channelIds = [];
			for (const challenge of challenges) {
				channelIds.push(challenge.channelId);
			}

			const challengeChannels = guild.channels.cache.filter((c) => channelIds.includes(c.id));
			
			challengeChannels.forEach((c) => {
			 	c.setParent(archiveCategory, {lockPermissions: false});
			 	c.send(`**Challenge has been archived**`);
			});

			interaction.reply(`**CTF has been archived**`);
			await ctfModel.updateOne({ done: true });
		} else {
			interaction.reply({ content: `Unknown subcommmand ${interaction.options.getSubcommand()}`, ephemeral: true });
		}
	}
};
