const { Schema, model } = require('mongoose');

const ctfSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	channelId: {
		type: String,
		required: true
	},
	guild: {
		type: Schema.Types.ObjectId,
		ref: 'Guild',
		required: true
	},
	done: {
		type: Boolean,
		default: false
	}
});

module.exports = model('Ctf', ctfSchema);
