const passport = require('passport');

// Reusable authentication middleware
module.exports = passport.authenticate('jwt', { session: false });
