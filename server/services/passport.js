const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const config = require('../config');

const localOptions = {
	usernameField: 'email',
};
const localStrategy = new LocalStrategy(
	localOptions,
	async (email, password, done) => {
		try {
			const user = await User.findOne({ email });
			if (!user || !(await user.comparePassword(password))) {
				return done(null, false);
			}
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	},
);
const jwtOptions = {
	secretOrKey: config.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
	try {
		const user = await User.findById(payload.sub);
		return done(null, user || false);
	} catch (error) {
		return done(error, false);
	}
});

passport.use(localStrategy);
passport.use(jwtStrategy);
