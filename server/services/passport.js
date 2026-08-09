const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const config = require('../config');

const localOptions = {
	usernameField: 'email',
};
const localStrategy = new LocalStrategy(localOptions, async function (
	email,
	password,
	done,
) {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return done(null, false);
		}
		user.comparePassword(password, function (error, isMatch) {
			if (error) {
				return done(error);
			}
			if (!isMatch) {
				return done(null, false);
			}
			return done(null, user);
		});
	} catch (error) {
		return done(error);
	}
});
const jwtOptions = {
	secretOrKey: config.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
};

const jwtStrategy = new JwtStrategy(jwtOptions, async function (payload, done) {
	try {
		const user = await User.findById(payload.sub);
		if (user) {
			return done(null, user);
		}
		return done(null, false);
	} catch (error) {
		return done(error, false);
	}
});

passport.use(localStrategy);
passport.use(jwtStrategy);
