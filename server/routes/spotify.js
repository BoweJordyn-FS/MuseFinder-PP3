const express = require('express');
const router = express.Router();
const spotify = require('../services/spotify');
const requireAuth = require('../middleware/requireAuth');

const client_url = process.env.CLIENT_URL || 'http://localhost:3000';

// ---- Authorization code flow ------------------------------------------

// gives the frontend the spotify login url, needs a login so we know who it is
router.get('/login', requireAuth, (req, res) => {
	res.json({ url: spotify.authorizeUrl(req.user._id) });
});

// spotify sends the browser back here with a code, swap it for tokens and save
router.get('/callback', async (req, res, next) => {
	const { code, state, error } = req.query;
	if (error) return res.redirect(`${client_url}/connect?error=${error}`);

	let userId;
	try {
		userId = spotify.userIdFromState(state);
	} catch {
		return res.redirect(`${client_url}/connect?error=state_mismatch`);
	}

	try {
		await spotify.exchangeCode(code, userId);
		res.redirect(client_url);
	} catch (err) {
		next(err);
	}
});

// use the stored refresh token to get a new access token.
router.get('/refresh_token', requireAuth, async (req, res, next) => {
	try {
		const refreshed = await spotify.refreshUserToken(req.user);
		if (!refreshed) {
			return res
				.status(400)
				.json({ error: 'Spotify not connected. Visit /login first.' });
		}
		res.json({ status: true });
	} catch (error) {
		next(error);
	}
});

// has this user connected spotify yet
router.get('/status', requireAuth, (req, res) => {
	res.json({ status: spotify.isConnected(req.user) });
});

// the user's top artists or tracks. /me/top/artists or /me/top/tracks
router.get('/me/top/:type', requireAuth, async (req, res, next) => {
	const { type } = req.params;
	if (type !== 'artists' && type !== 'tracks') {
		return res.status(400).json({ error: 'type must be artists or tracks' });
	}
	try {
		const items = await spotify.getTopItems(req.user, type, req.query.limit);
		if (!items) return res.status(400).json({ error: 'Spotify not connected' });
		res.json(items);
	} catch (error) {
		next(error);
	}
});

// the user's spotify profile, refreshes the token first if it expired
router.get('/me', requireAuth, async (req, res, next) => {
	try {
		const profile = await spotify.getUserProfile(req.user);
		if (!profile) {
			return res.status(400).json({ error: 'Spotify not connected' });
		}
		res.json(profile);
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
