const { ChannelType } = require('discord.js');
const getCategory = require('./getCategory');

module.exports = async (guild, channelName, categoryName = null, onlyForIds = []) => {
	let category = null;
	
	if (categoryName) {
		category = await getCategory(guild, categoryName);
	}

	const new_channel = await guild.channels.create({name: channelName, type: ChannelType.GuildText});
	
	if (category) {
		new_channel.setParent(category, {lockPermissions: false});
	}
	
	if (onlyForIds.length >= 1) {
		new_channel.permissionOverwrites.create(guild.roles.everyone, {ViewChannel: false});
		for (const id of onlyForIds) {
			new_channel.permissionOverwrites.create(id, {ViewChannel: true});
		}
	}

	return new_channel;
};
