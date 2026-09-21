import api from '@/lib/api';

// url segment -> spotify type
export const CATEGORIES = {
	artists: 'artist',
	albums: 'album',
	tracks: 'track',
};

// no type = all three, with type = just that one. 10 per page, use offset for more
export const search = async (q, { type, offset = 0 } = {}) => {
	const { data } = await api.get('/spotify/v1/search', {
		params: { q, type, offset },
	});
	return data;
};

// turn a spotify item into the subject shape the post model wants
export const toSubject = (item) => ({
	spotify_id: item.id,
	type: item.type,
	name: item.name,
	artist: item.artists?.map((a) => a.name).join(', '),
	image_url: (item.images ?? item.album?.images)?.[0]?.url,
	spotify_url: item.external_urls?.spotify,
	release_date: item.release_date ?? item.album?.release_date,
});
