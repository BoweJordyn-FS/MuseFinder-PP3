import api from './api';

export const getPlaylists = (username) =>
	api.get(`/playlists/${username}`).then((r) => r.data);

export const createPlaylist = (username, name) =>
	api.post('/playlists', { username, name }).then((r) => r.data);

export const addSong = (playlistId, song) =>
	api.post(`/playlists/${playlistId}/songs`, song).then((r) => r.data);

export const removeSong = (playlistId, mbid) =>
	api.delete(`/playlists/${playlistId}/songs/${mbid}`).then((r) => r.data);

export const deletePlaylist = (playlistId) =>
	api.delete(`/playlists/${playlistId}`).then((r) => r.data);

export const updatePlaylist = (playlistId, body) =>
	api.patch(`/playlists/${playlistId}`, body).then((r) => r.data);
