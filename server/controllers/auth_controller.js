const User = require('../models/User');
const jwt = require('jwt-simple');
const config = require('../config');

const tokenForUser = (user) => {
	const now = Math.floor(Date.now() / 1000);
	return jwt.encode(
		{
			sub: user.id,
			iat: now,
			exp: now + 60 * 60 * 24 * 7,
		},
		config.secret,
	);
};
// what the client gets back from login, signup and /me
const publicUser = (user) => ({
	user_id: user._id,
	username: user.username,
	email: user.email,
});

exports.login = (req, res) => {
	res.json({ token: tokenForUser(req.user), ...publicUser(req.user) });
};

exports.me = (req, res) => {
	res.json(publicUser(req.user));
};

exports.signup = async (req, res, next) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		return res
			.status(422)
			.json({ error: 'please provide a username, email and password' });
	}

	try {
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});
		if (existingUser) {
			const field = existingUser.email === email ? 'Email' : 'Username';
			return res.status(422).json({ error: `${field} already in use` });
		}

		const user = new User({ username, email, password });
		await user.save();

		res.status(201).json({ token: tokenForUser(user), ...publicUser(user) });
	} catch (error) {
		next(error);
	}
};
