const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();
const spotify = require('../services/spotify');
const SpotifyToken = require('../models/SpotifyToken');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const redirect_uri =
	process.env.SPOTIFY_REDIRECT_URI ||
	'http://127.0.0.1:3001/spotify/v1/callback';
const client_url = process.env.CLIENT_URL || 'http://localhost:3000';

let pendingState = null;

// Save (or replace) the one token document.
const saveToken = async (data) => {
	await SpotifyToken.findOneAndUpdate(
		{},
		{
			access_token: data.access_token,
			refresh_token: data.refresh_token,
			expires_at: new Date(Date.now() + data.expires_in * 1000),
		},
		{ upsert: true },
	);
};

// ---- Authorization code flow ------------------------------------------

// send the browser to Spotify's login page.
router.get('/login', (req, res) => {
	pendingState = crypto.randomBytes(8).toString('hex');
	const params = new URLSearchParams({
		response_type: 'code',
		client_id,
		scope: 'user-read-private user-read-email',
		redirect_uri,
		state: pendingState,
	});
	res.redirect('https://accounts.spotify.com/authorize?' + params);
});

// Spotify sends the browser back here with a code. Swap the code
// for tokens, store them in the database, then go back to the frontend.
router.get('/callback', async (req, res, next) => {
	const { code, state } = req.query;
	if (!state || state !== pendingState) {
		return res.status(400).json({ error: 'state_mismatch' });
	}
	pendingState = null;

	try {
		const { data } = await axios.post(
			'https://accounts.spotify.com/api/token',
			new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri,
			}),
			{ auth: { username: client_id, password: client_secret } },
		);
		await saveToken(data);
		res.redirect(client_url);
	} catch (error) {
		next(error);
	}
});

// use the stored refresh token to get a new access token.
router.get('/refresh_token', async (req, res, next) => {
	try {
		const stored = await SpotifyToken.findOne();
		if (!stored || !stored.refresh_token) {
			return res
				.status(400)
				.json({ error: 'No refresh token stored. Visit /login first.' });
		}

		const { data } = await axios.post(
			'https://accounts.spotify.com/api/token',
			new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: stored.refresh_token,
			}),
			{ auth: { username: client_id, password: client_secret } },
		);
		// if spotify doesn't send a new refresh token keep the old one.
		await saveToken({
			...data,
			refresh_token: data.refresh_token || stored.refresh_token,
		});
		res.json({ status: true });
	} catch (error) {
		next(error);
	}
});

// Is there a valid, unexpired token stored in the database?
router.get('/status', async (req, res, next) => {
	try {
		const stored = await SpotifyToken.findOne();
		res.json({ status: Boolean(stored) && stored.expires_at > new Date() });
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
