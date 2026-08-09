const User = require('../models/User');
const jwt = require('jwt-simple');
const config = require('../config');

const tokenForUser = (user) => {
	const timestamp = new Date().getTime();
	return jwt.encode(
		{
			sub: user.id,
			iat: timestamp,
		},
		config.secret,
	);
};
exports.login = async (req, res, next) => {
	res.send({ token: tokenForUser(req.user), user_id: req.user._id });
};

exports.signup = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(422)
			.json({ error: 'please provide your email and password' });
	}

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(422).json({ error: 'Email already in use' });
		}

		const user = new User({ email, password });
		await user.save();

		res.status(201).json({
			user_id: user._id,
			token: tokenForUser(user),
			message: 'User created successfully',
		});
	} catch (error) {
		next(error);
	}
};
