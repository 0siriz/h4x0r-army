const { ChannelType } = require('discord.js');

module.exports = async (guild, categoryName) => {
	let category = guild.channels.cache.find((c) => c.name === categoryName && c.type == ChannelType.GuildCategory);
	if (typeof category !== "undefined") return category;

	return await guild.channels.create({name: categoryName, type: ChannelType.GuildCategory});
};
