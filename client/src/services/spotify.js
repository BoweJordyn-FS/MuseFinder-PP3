import api from '@/lib/api';

// Plural URL segment -> singular Spotify type. Also the list of valid
// category pages.
export const CATEGORIES = {
	artists: 'artist',
	albums: 'album',
	tracks: 'track',
};

// No type -> { artists, albums, tracks }, 10 each.
// With type -> just that key. Spotify caps limit at 10; page with offset.
export const search = async (q, { type, offset = 0 } = {}) => {
	const { data } = await api.get('/spotify/v1/search', {
		params: { q, type, offset },
	});
	return data;
};
