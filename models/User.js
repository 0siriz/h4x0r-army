const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	guild: {
		type: Schema.Types.ObjectId,
		ref: 'Guild',
		required: true
	}
});

module.exports = model('User', userSchema);
