const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/auth_controller');
const requireAuth = require('../middleware/requireAuth');

const requireLogin = (req, res, next) =>
	passport.authenticate('local', { session: false }, (error, user) => {
		if (error) return next(error);
		if (!user) {
			return res.status(401).json({ error: 'Wrong email or password' });
		}
		req.user = user;
		next();
	})(req, res, next);

router.post('/signup', AuthController.signup);
router.post('/login', requireLogin, AuthController.login);
router.get('/me', requireAuth, AuthController.me);

module.exports = router;
