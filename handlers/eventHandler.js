const path = require('path');
const getAllFiles = require("../utils/getAllFiles");
const getBotFolder = require("../utils/getBotFolder")

module.exports = (client, clientId) => {
	const eventFolders = [
		...getAllFiles(path.join(__dirname, '..', 'events'), true),
		...getAllFiles(path.join(getBotFolder(clientId), 'events'), true)
	]

	for (const eventFolder of eventFolders) {
		const eventFiles = getAllFiles(eventFolder);
		eventFiles.sort((a, b) => a > b);
		
		const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

		client.on(eventName, async (arg) => {
			for (const eventFile of eventFiles) {
				const eventFunction = require(eventFile);
				await eventFunction(client, arg);
			}
		});
	}
};
