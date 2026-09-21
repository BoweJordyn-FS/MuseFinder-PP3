const axios = require('axios');
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/User');

const ACCOUNTS_URL = 'https://accounts.spotify.com';
const API_URL = 'https://api.spotify.com/v1';
const SCOPES = 'user-read-private user-read-email user-top-read';

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

const tokenFields = (data) => ({
	access_token: data.access_token,
	refresh_token: data.refresh_token,
	expires_at: new Date(Date.now() + data.expires_in * 1000),
});

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

const search = async (
	q,
	type = 'artist,album,track',
	limit = 10,
	offset = 0,
) => {
	limit = Math.min(Math.max(Number(limit) || 10, 1), 10);
	offset = Math.max(Number(offset) || 0, 0);
	const { data } = await axios.get(`${API_URL}/search`, {
		params: { q, type, limit, offset },
		headers: { Authorization: `Bearer ${await getToken()}` },
	});
	return data;
};

// ---- Authorization code flow (per-user token, stored on the user) ------

// state is the user id signed as a jwt. spotify sends it back on /callback
// so we know who the tokens belong to
const authorizeUrl = (userId) => {
	const state = jwt.encode(
		{ sub: String(userId), exp: Math.floor(Date.now() / 1000) + 600 },
		config.secret,
	);
	const params = new URLSearchParams({
		response_type: 'code',
		client_id,
		scope: SCOPES,
		redirect_uri,
		state,
	});
	return `${ACCOUNTS_URL}/authorize?${params}`;
};

const userIdFromState = (state) => jwt.decode(state, config.secret).sub;

// swap the code from /callback for tokens and save them on the user
const exchangeCode = async (code, userId) => {
	const data = await requestToken({
		grant_type: 'authorization_code',
		code,
		redirect_uri,
	});
	await User.findByIdAndUpdate(userId, { spotify: tokenFields(data) });
};

// use the user's refresh token to get a new access token
const refreshUserToken = async (user) => {
	const refresh_token = user.spotify?.refresh_token;
	if (!refresh_token) return null;
	const data = await requestToken({
		grant_type: 'refresh_token',
		refresh_token,
	});
	// if spotify doesn't send a new refresh token keep the old one
	user.spotify = tokenFields({
		...data,
		refresh_token: data.refresh_token || refresh_token,
	});
	await user.save();
	return user.spotify.access_token;
};

// the user's access token, refreshed first if it expired
const getUserToken = async (user) => {
	const { access_token, expires_at } = user.spotify ?? {};
	if (access_token && expires_at > new Date()) return access_token;
	return refreshUserToken(user);
};

// true if the user has connected spotify
const isConnected = (user) => Boolean(user.spotify?.refresh_token);

// the user's spotify profile
const getUserProfile = async (user) => {
	const accessToken = await getUserToken(user);
	if (!accessToken) return null;
	const { data } = await axios.get(`${API_URL}/me`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
};

module.exports = {
	getToken,
	search,
	authorizeUrl,
	userIdFromState,
	exchangeCode,
	refreshUserToken,
	getUserToken,
	isConnected,
	getUserProfile,
};
