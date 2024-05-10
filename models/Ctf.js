const { Schema, model } = require('mongoose');

const ctfSchema = new Schema({
	ctfName: {
		type: String,
		required: true
	},
	guildId: {
		type: String,
		required: true
	}
});

module.exports = model('Ctf', ctfSchema);
