const axios = require('axios');

// The app token from Spotify. Lasts one hour; we keep it in memory and
// only ask for a new one once it has expired.
let token = null;
let expiresAt = 0;

const getToken = async () => {
	if (token && Date.now() < expiresAt) return token;

	const { data } = await axios.post(
		'https://accounts.spotify.com/api/token',
		new URLSearchParams({ grant_type: 'client_credentials' }),
		{
			auth: {
				username: process.env.SPOTIFY_CLIENT_ID,
				password: process.env.SPOTIFY_CLIENT_SECRET,
			},
		},
	);

	token = data.access_token;
	expiresAt = Date.now() + data.expires_in * 1000;
	return token;
};

const hasToken = () => Boolean(token) && Date.now() < expiresAt;

// type: comma-separated list of artist/album/track.
// Spotify's search currently rejects limit > 10, so it's clamped. Use
// offset to page through the rest.
const search = async (q, type = 'artist,album,track', limit = 10, offset = 0) => {
	limit = Math.min(Math.max(Number(limit) || 10, 1), 10);
	offset = Math.max(Number(offset) || 0, 0);
	const { data } = await axios.get('https://api.spotify.com/v1/search', {
		params: { q, type, limit, offset },
		headers: { Authorization: `Bearer ${await getToken()}` },
	});
	return data;
};

module.exports = { getToken, hasToken, search };
