import api from './api';

typeArr = ['album', 'artist', 'track'];

export const search = (q, type = typeArr) => {
	api.get(`https://api.spotify.com/v1/search?${type}`).then((res) => res.data);
};
export const getSong = (id) =>
	api.get(`https://api.spotify.com/v1/track/${id}`);

export const getArtist = (id) => {
	api.get(`https://api.spotify.com/v1/artists/${id}`);
};
export const getAlbum = (id) => {
	api.get(`https://api.spotify.com/v1/album/${id}`);
};
