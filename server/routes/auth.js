const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportServices = require('../services/passport');
const requireLogin = passport.authenticate('local', { session: false });
const AuthController = require('../controllers/auth_controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/signup', AuthController.signup);
router.post('/login', requireLogin, AuthController.login);
router.get('/me', requireAuth, (req, res) => {
	res.json({
		user_id: req.user._id,
		username: req.user.username,
		email: req.user.email,
	});
});
module.exports = router;
