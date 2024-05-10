const { Schema, model } = require('mongoose');

const ctfSchema = new Schema({
	ctfName: {
		type: String,
		required: true
	},
	guild: {
		type: Schema.Types.ObjectId,
		ref: 'Guild',
		required: true
	}
});

module.exports = model('Ctf', ctfSchema);
