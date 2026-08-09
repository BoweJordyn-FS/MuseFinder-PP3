const passport = require('passport');

// Reusable authentication middleware. Rejects any request that does not carry a
// valid JWT (sent as `Authorization: bearer <token>`).
module.exports = passport.authenticate('jwt', { session: false });
