const { Schema, model } = require('mongoose');

const channelSchema = new Schema({
	channelId: {
		type: String,
		required: true
	},
	guild: {
		type: Schema.Types.ObjectId,
		ref: 'Guild',
		required: true
	}
});

module.exports = model('Channel', channelSchema);
