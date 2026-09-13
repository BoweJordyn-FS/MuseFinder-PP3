const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATABASEURL = process.env.DATABASEURL;

mongoose.connect(DATABASEURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Passport configuration
require('./services/passport');

// Routes
// /api/v1 holds MuseFinder's own data (accounts, reviews, collections).
// /spotify/v1 is reserved for the Spotify middleware layer.
const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

app.use('/spotify/v1/auth', authRoutes);

const spotifyRoutes = require('./routes/spotify');
app.use('/spotify/v1', spotifyRoutes);

const postRoutes = require('./routes/posts');
app.use('/api/v1/posts', postRoutes);

const playlistRoutes = require('./routes/playlists');
app.use('/api/v1/playlists', playlistRoutes);

app.use((req, res) => {
	res
		.status(404)
		.json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

// Errors passed to next() land here as JSON instead of Express's HTML page.
app.use((error, req, res, next) => {
	// Mongoose schema violations and malformed ObjectIds are client errors.
	if (error.name === 'ValidationError' || error.name === 'CastError') {
		return res.status(400).json({ error: error.message });
	}
	console.error(error);
	res.status(error.status || 500).json({ error: error.message });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
