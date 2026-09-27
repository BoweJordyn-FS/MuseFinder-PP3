import api from '@/lib/api';

// all under /api/v1/playlists, every one needs a login

export const getPlaylists = async () => {
	const { data } = await api.get('/api/v1/playlists');
	return data; // [{ _id, name, description, postCount }]
};

export const getPlaylist = async (id) => {
	const { data } = await api.get(`/api/v1/playlists/${id}`);
	return data; // { _id, name, description, posts: [...] }
};

// { name, description }
export const createPlaylist = async (body) => {
	const { data } = await api.post('/api/v1/playlists', body);
	return data;
};

// { name, description }
export const updatePlaylist = async (id, body) => {
	const { data } = await api.patch(`/api/v1/playlists/${id}`, body);
	return data;
};

export const deletePlaylist = async (id) => {
	const { data } = await api.delete(`/api/v1/playlists/${id}`);
	return data;
};

// subject = the album/track, from toSubject()
export const addItem = async (playlistId, subject) => {
	const { data } = await api.post(`/api/v1/playlists/${playlistId}/items`, {
		subject,
	});
	return data;
};

export const removeItem = async (playlistId, spotifyId) => {
	const { data } = await api.delete(
		`/api/v1/playlists/${playlistId}/items/${spotifyId}`,
	);
	return data;
};
