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
});
userSchema.pre('save', async function () {
	const user = this;
	if (!user.isNew && !user.isModified('password')) {
		return;
	}

	const salt = await new Promise((resolve, reject) => {
		bcrypt.genSalt(10, (error, salt) =>
			error ? reject(error) : resolve(salt),
		);
	});
	const hash = await new Promise((resolve, reject) => {
		bcrypt.hash(user.password, salt, null, (error, hash) =>
			error ? reject(error) : resolve(hash),
		);
	});
	user.password = hash;
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
