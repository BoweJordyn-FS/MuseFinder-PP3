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
const authRoutes = require('./routes/auth');
app.use('/spotify/v1/auth', authRoutes);

// The Next.js client runs on its own server, so anything that reaches here
// is an unmatched API route
app.use((req, res) => {
	res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
