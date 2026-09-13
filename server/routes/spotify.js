const express = require('express');
const router = express.Router();
const spotify = require('../services/spotify');

// Is there a valid token in memory right now?
router.get('/status', (req, res) => {
	res.json({ status: spotify.hasToken() });
});

// Fetch a token from Spotify. The token itself stays on the server.
router.get('/token', async (req, res, next) => {
	try {
		await spotify.getToken();
		res.json({ status: true });
	} catch (error) {
		next(error);
	}
});

// GET /search?q=radiohead
router.get('/search', async (req, res, next) => {
	if (!req.query.q) {
		return res.status(400).json({ error: 'q is required' });
	}
	try {
		res.json(await spotify.search(req.query.q));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
