import api from '@/lib/api';

// Returns { artists, albums, tracks }, each with an `items` array.
export const search = async (q) => {
	const { data } = await api.get('/spotify/v1/search', { params: { q } });
	return data;
};
