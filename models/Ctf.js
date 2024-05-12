const { Schema, model } = require('mongoose');

const ctfSchema = new Schema({
	ctfName: {
		type: String,
		required: true
	},
	channel: {
		type: Schema.Types.ObjectId,
		ref: 'Channel',
		required: true
	},
	done: {
		type: Boolean,
		default: false
	}
});

module.exports = model('Ctf', ctfSchema);
