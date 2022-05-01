const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: 'You need to provide a user name!',
			unique: true,
			trim: true
		},
		email: {
			type: String,
			required: 'You must provide a valid email!',
			unique: true,
			match: [/^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/, 'Please fill a valid email']
		},
	},
	{
		toJSON: {
			virtuals: false,
			getters: true
		},
		id: false
	}
);

const User = model('User', UserSchema);

module.exports = User;