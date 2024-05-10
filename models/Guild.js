const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
	guildId: {
		type: String,
		required: true
	},
	roleId: {
		type: String,
		default: ''
	}
});

module.exports = model('Guild', guildSchema);
