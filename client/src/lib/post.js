import api from './api';

export const getPosts = () => api.get('/posts').then((res) => res.data);

export const getPostsByUser = (username) =>
	api.get(`/posts/user/${username}`).then((res) => res.data);

export const getPost = (id) => api.get(`/posts/${id}`).then((res) => res.data);

export const createPost = (post) =>
	api.post('/posts', post).then((res) => res.data);

export const updatePost = (id, body) =>
	api.put(`/posts/${id}`, body).then((res) => res.data);

export const likePost = (id) =>
	api.patch(`/posts/${id}/like`).then((res) => res.data);

export const deletePost = (id) =>
	api.delete(`/posts/${id}`).then((res) => res.data);
