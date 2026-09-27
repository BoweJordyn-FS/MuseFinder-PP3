const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validateEmail = (email) => {
	return /^\S+@\S+\.\S+$/.test(email);
};
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: 'Email address is required',
		validate: [validateEmail, 'Email Invalid'],
	},
	password: {
		type: String,
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now,
	},
	// spotify tokens from the authorization code flow, one set per user
	spotify: {
		access_token: String,
		refresh_token: String,
		expires_at: Date,
	},
});
userSchema.pre('save', async function () {
	const user = this;
	if (!user.isNew && !user.isModified('password')) {
		return;
	}

	user.password = await bcrypt.hash(user.password, 10);
});
userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
