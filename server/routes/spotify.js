const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const spotify = require('../services/spotify');

const client_url = process.env.CLIENT_URL || 'http://localhost:3000';

let pendingState = null;

// ---- Authorization code flow ------------------------------------------

// send the browser to Spotify's login page.
router.get('/login', (req, res) => {
	pendingState = crypto.randomBytes(8).toString('hex');
	res.redirect(spotify.authorizeUrl(pendingState));
});

// spotify sends the browser back here with a code, swap it for tokens and save
router.get('/callback', async (req, res, next) => {
	const { code, state } = req.query;
	if (!state || state !== pendingState) {
		return res.status(400).json({ error: 'state_mismatch' });
	}
	pendingState = null;
	try {
		await spotify.exchangeCode(code);
		res.redirect(client_url);
	} catch (error) {
		next(error);
	}
});

// use the stored refresh token to get a new access token.
router.get('/refresh_token', async (req, res, next) => {
	try {
		const refreshed = await spotify.refreshToken();
		if (!refreshed) {
			return res
				.status(400)
				.json({ error: 'No refresh token stored. Visit /login first.' });
		}
		res.json({ status: true });
	} catch (error) {
		next(error);
	}
});

// is there a valid token in the db
router.get('/status', async (req, res, next) => {
	try {
		res.json({ status: await spotify.hasStoredToken() });
	} catch (error) {
		next(error);
	}
});

// ---- Client credentials (app token, used for search) -------------------

router.get('/token', async (req, res, next) => {
	try {
		await spotify.getToken();
		res.json({ status: true });
	} catch (error) {
		next(error);
	}
});

// GET /search?q=radiohead — all three types
// GET /search?q=radiohead&type=artist&offset=10 — one type, next page
router.get('/search', async (req, res, next) => {
	const { q, type, limit, offset } = req.query;
	if (!q) {
		return res.status(400).json({ error: 'q is required' });
	}
	try {
		res.json(await spotify.search(q, type, limit, offset));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
