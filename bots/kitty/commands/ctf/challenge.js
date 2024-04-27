const { ApplicationCommandOptionType, MessageMentions: { users } } = require('discord.js');
const getCategory = require('../../../../utils/getCategory');
const createChannel = require('../../../../utils/createChannel');
const { ctfActiveName, ctfActiveChallengeName, ctfCompletedChallengeName, ctfPlayerRoleId } = require('../../../../config.json');

const Categories = {
	Web: 'web',
	Pwn: 'pwn',
	Crypto: 'crypto',
	Forensics: 'forensics',
	Rev: 'rev',
	Misc: 'misc',
	Blockchain: 'blockchain',
	Hardware: 'hardware',
	Other: 'other'
}

module.exports = {
	name: 'challenge',
	description: 'Handle CTF challenges',
	options: [
		{
			name: 'add',
			description: 'Add a challenge to a CTF',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'category',
					description: 'The category of the challenge',
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: 'Web', value: Categories.Web},
						{ name: 'Pwn', value: Categories.Pwn},
						{ name: 'Crypto', value: Categories.Crypto},
						{ name: 'Forensics', value: Categories.Forensics},
						{ name: 'Rev', value: Categories.Rev},
						{ name: 'Misc', value: Categories.Misc},
						{ name: 'Blockchain', value: Categories.Blockchain},
						{ name: 'Hardware', value: Categories.Hardware},
						{ name: 'Other', value: Categories.Other}
					],
					required: true
				},
				{
					name: 'name',
					description: 'The name of the challenge',
					type: ApplicationCommandOptionType.String,
					required: true
				},
				{
					name: 'description',
					description: 'The challenge description',
					type: ApplicationCommandOptionType.String,
					required: false
				},
				{
					name: 'file',
					description: 'Challenge file',
					type: ApplicationCommandOptionType.Attachment,
					required: false
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

		const guild = interaction.member.guild;

		if (interaction.options.getSubcommand() === 'add') {
			const category = interaction.options.getString('category');
			const name = interaction.options.getString('name');
			const activeCtfCategory = await getCategory(guild, ctfActiveName);
			const ctfChannel = guild.channels.cache.find((c) => c.id == interaction.channelId && c.parentId === activeCtfCategory.id);
			if (ctfChannel === undefined) {
				interaction.editReply(`This command must be called from a CTF Channel`);
				return;
			}

			const challengeName = `${ctfChannel.name}_${category}-${name}`;

			const createdChallenge = await createChannel(guild, challengeName, ctfActiveChallengeName, [ctfPlayerRoleId]);

			interaction.editReply(`Challenge <#${createdChallenge.id}> added`);
			createdChallenge.send(`Challenge started by <@${interaction.user.id}>`);
		} else if (interaction.options.getSubcommand() === 'done') {
			const activeChallengeCategory = await getCategory(guild, ctfActiveChallengeName);
			const completedChallengeCategory = await getCategory(guild, ctfCompletedChallengeName);
			const challengeChannel = guild.channels.cache.find((c) => c.id === interaction.channelId && c.parentId === activeChallengeCategory.id);
			if (challengeChannel === undefined) {
				interaction.editReply(`This command must be called from a Challenge Channel`);
				return;
			}

			challengeChannel.setParent(completedChallengeCategory, {lockPermissions: false});

			let usersString = `<@${interaction.user.id}>`;
			const credit = interaction.options.getString('credit');
			const chalName = interaction.channel.name.split('_')[1];
			if (credit) {
				const others = credit.match(users);
				if (others) {
					usersString = `${usersString}, ${others.input.split(' ').join(', ')}`;
				}
			}
			const ctfName = interaction.channel.name.split('_')[0];
			const ctfChannel = guild.channels.cache.find((c) => c.name === ctfName);
			interaction.editReply(`**Challenge completed by ${usersString} :tada:**`);
			ctfChannel.send(`**Challenge ${chalName} completed by ${usersString} :tada:**`);
		}
	}
};
