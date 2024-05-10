const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
	guildId: {
		type: String,
		required: true
	},
	ctfRoleId: {
		type: String,
		default: ''
	}
});

module.exports = model('Guild', guildSchema);
