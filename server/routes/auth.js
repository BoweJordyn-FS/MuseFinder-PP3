const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/auth_controller');
const requireAuth = require('../middleware/requireAuth');

const requireLogin = passport.authenticate('local', { session: false });

router.post('/signup', AuthController.signup);
router.post('/login', requireLogin, AuthController.login);
router.get('/me', requireAuth, AuthController.me);

module.exports = router;
