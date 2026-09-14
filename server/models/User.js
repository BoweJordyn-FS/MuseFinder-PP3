const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validateEmail = (email) => {
	return /^\S+@\S+\.\S+$/.test(email);
};
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: 'Username is required',
	},
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
});
userSchema.pre('save', async function () {
	const user = this;
	if (!user.isNew && !user.isModified('password')) {
		return;
	}

	// bcryptjs's hash(password, rounds) generates the salt itself and
	// returns a promise. (The old 4-argument form was bcrypt-nodejs's
	// signature; under bcryptjs it silently produced an undefined hash.)
	user.password = await bcrypt.hash(user.password, 10);
});
userSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function (error, isMatch) {
		if (error) {
			return callback(error);
		}
		callback(null, isMatch);
	});
};
module.exports = mongoose.model('User', userSchema);
