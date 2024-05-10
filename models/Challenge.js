const { Schema, model } = require('mongoose');

const challengeSchema = new Schema({
	challengeName: {
		type: String,
		required: true
	},
	ctf: {
		type: Schema.Types.ObjectId,
		ref: 'Ctf',
		required: true
	},
	category: {
		type: String,
		required: true
	},
	assignedUsers: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = model('Challenge', challengeSchema);
