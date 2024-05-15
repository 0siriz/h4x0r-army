const { Schema, model } = require('mongoose');

const challengeSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	ctf: {
		type: Schema.Types.ObjectId,
		ref: 'Ctf',
		required: true
	},
	channelId: {
		type: String,
		required: true
	},
	assignedUsers: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = model('Challenge', challengeSchema);
