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
// express 5 leaves req.body undefined when there's no body, an empty
// object is easier to work with everywhere
app.use((req, res, next) => {
	if (!req.body) req.body = {};
	next();
});
app.use(cors());
app.use(passport.initialize());

// Passport configuration
require('./services/passport');

// Routes
// /api/v1 is our stuff, /spotify/v1 is the spotify middleware
const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

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

// error handler, sends json instead of the express html page
app.use((error, req, res, next) => {
	// bad input from the client
	if (error.name === 'ValidationError' || error.name === 'CastError') {
		return res.status(400).json({ error: error.message });
	}
	console.error(error);
	res.status(error.status || 500).json({ error: error.message });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
