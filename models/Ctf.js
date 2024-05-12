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
	}
});

module.exports = model('Ctf', ctfSchema);
