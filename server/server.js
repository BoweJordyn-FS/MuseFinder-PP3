const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
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
const authRoutes = require('./routes/auth');
app.use('/spotify/v1/auth', authRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all route to serve the React app for any other requests
app.get('/{*splat}', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
