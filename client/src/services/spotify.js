import api from '@/lib/api';

export const CATEGORIES = {
	artists: 'artist',
	albums: 'album',
	tracks: 'track',
};

export const search = async (q, { type, offset = 0 } = {}) => {
	const { data } = await api.get('/spotify/v1/search', {
		params: { q, type, offset },
	});
	return data;
};

export const toSubject = (item) => ({
	spotify_id: item.id,
	type: item.type,
	name: item.name,
	artist: item.artists?.map((a) => a.name).join(', '),
	image_url: (item.images ?? item.album?.images)?.[0]?.url,
	spotify_url: item.external_urls?.spotify,
	release_date: item.release_date ?? item.album?.release_date,
	// artists don't have an artist line, show genres instead
	subtitle:
		item.type === 'artist'
			? item.genres?.slice(0, 2).join(' · ') || 'Artist'
			: item.artists?.map((a) => a.name).join(', '),
});

// ---- user's own spotify connection (needs a musefinder login) ----------

export const getConnectUrl = async () => {
	const { data } = await api.get('/spotify/v1/login');
	return data.url;
};

export const getSpotifyStatus = async () => {
	const { data } = await api.get('/spotify/v1/status');
	return data;
};

// the user's spotify profile (display_name, images, ...)
export const getSpotifyProfile = async () => {
	const { data } = await api.get('/spotify/v1/me');
	return data;
};
