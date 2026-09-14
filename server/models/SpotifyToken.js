const mongoose = require('mongoose');

const SpotifyTokenSchema = new mongoose.Schema({
	access_token: String,
	refresh_token: String,
	expires_at: Date,
});

module.exports = mongoose.model('SpotifyToken', SpotifyTokenSchema);
