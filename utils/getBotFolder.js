const path = require('path');
const getBotFolders = require('./getBotFolders');

module.exports = (targetId) => {
	const botFolders = getBotFolders();
	for (const botFolder of botFolders) {
		const filePath = path.join(botFolder, 'config.json')
		const { clientId } = require(filePath);

		if (clientId === targetId) {
			return botFolder;
		}
	}
	return null;
};
