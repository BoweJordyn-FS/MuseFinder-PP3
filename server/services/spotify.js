const axios = require('axios');
const SpotifyToken = require('../models/SpotifyToken');

const ACCOUNTS_URL = 'https://accounts.spotify.com';
const API_URL = 'https://api.spotify.com/v1';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri =
	process.env.SPOTIFY_REDIRECT_URI ||
	'http://127.0.0.1:3001/spotify/v1/callback';

// every token request looks the same apart from the grant params
const requestToken = async (params) => {
	const { data } = await axios.post(
		`${ACCOUNTS_URL}/api/token`,
		new URLSearchParams(params),
		{ auth: { username: client_id, password: client_secret } },
	);
	return data;
};

// ---- Client credentials (app token, used for search) -------------------

// app token from spotify, lasts an hour. kept in memory until it expires
let token = null;
let expiresAt = 0;

const getToken = async () => {
	if (token && Date.now() < expiresAt) return token;
	const data = await requestToken({ grant_type: 'client_credentials' });
	token = data.access_token;
	expiresAt = Date.now() + data.expires_in * 1000;
	return token;
};

// spotify won't take limit > 10 anymore so clamp it, use offset for more
const search = async (q, type = 'artist,album,track', limit = 10, offset = 0) => {
	limit = Math.min(Math.max(Number(limit) || 10, 1), 10);
	offset = Math.max(Number(offset) || 0, 0);
	const { data } = await axios.get(`${API_URL}/search`, {
		params: { q, type, limit, offset },
		headers: { Authorization: `Bearer ${await getToken()}` },
	});
	return data;
};

// ---- Authorization code flow (user token, stored in the db) ------------

const authorizeUrl = (state) => {
	const params = new URLSearchParams({
		response_type: 'code',
		client_id,
		scope: 'user-read-private user-read-email',
		redirect_uri,
		state,
	});
	return `${ACCOUNTS_URL}/authorize?${params}`;
};

// only ever one token doc, overwrite it
const saveToken = (data) =>
	SpotifyToken.findOneAndUpdate(
		{},
		{
			access_token: data.access_token,
			refresh_token: data.refresh_token,
			expires_at: new Date(Date.now() + data.expires_in * 1000),
		},
		{ upsert: true },
	);

// swap the code from /callback for tokens and save them
const exchangeCode = async (code) => {
	const data = await requestToken({
		grant_type: 'authorization_code',
		code,
		redirect_uri,
	});
	await saveToken(data);
};

// use the stored refresh token to get a new access token
const refreshToken = async () => {
	const stored = await SpotifyToken.findOne();
	if (!stored?.refresh_token) return false;
	const data = await requestToken({
		grant_type: 'refresh_token',
		refresh_token: stored.refresh_token,
	});
	// if spotify doesn't send a new refresh token keep the old one
	await saveToken({
		...data,
		refresh_token: data.refresh_token || stored.refresh_token,
	});
	return true;
};

// is there a valid token in the db
const hasStoredToken = async () => {
	const stored = await SpotifyToken.findOne();
	return Boolean(stored) && stored.expires_at > new Date();
};

module.exports = {
	getToken,
	search,
	authorizeUrl,
	exchangeCode,
	refreshToken,
	hasStoredToken,
};
