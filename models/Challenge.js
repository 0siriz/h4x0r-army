const { Schema, model } = require('mongoose');

const challengeSchema = new Schema({
	challengeName: {
		type: String,
		required: true
	},
	ctfName: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	assignedUsers: [{
		type: String
	}]
});

module.exports = model('Challenge', challengeSchema);
