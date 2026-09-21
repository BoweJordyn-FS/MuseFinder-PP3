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

export const addPost = async (playlistId, postId) => {
	const { data } = await api.post(`/api/v1/playlists/${playlistId}/posts`, {
		postId,
	});
	return data;
};

export const removePost = async (playlistId, postId) => {
	const { data } = await api.delete(
		`/api/v1/playlists/${playlistId}/posts/${postId}`,
	);
	return data;
};
