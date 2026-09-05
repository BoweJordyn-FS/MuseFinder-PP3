const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportServices = require('../services/passport');
const requireLogin = passport.authenticate('local', { session: false });
const AuthController = require('../controllers/auth_controller');

router.post('/signup', AuthController.signup);
router.post('/login', requireLogin, AuthController.login);
module.exports = router;
