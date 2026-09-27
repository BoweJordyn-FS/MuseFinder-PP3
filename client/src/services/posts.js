import api from '@/lib/api';

// all under /api/v1/posts, jwt gets attached by lib/api

// filters: subjectId, subjectType, author, limit, page
export const getPosts = async (filters = {}) => {
	const { data } = await api.get('/api/v1/posts', { params: filters });
	return data; // { posts, total, page, limit }
};

export const getPostsByUser = (userId) => getPosts({ author: userId });

export const getPost = async (id) => {
	const { data } = await api.get(`/api/v1/posts/${id}`);
	return data;
};

// { type, content, rating, subject }
export const createPost = async (body) => {
	const { data } = await api.post('/api/v1/posts', body);
	return data;
};

// { content, rating }
export const updatePost = async (id, body) => {
	const { data } = await api.patch(`/api/v1/posts/${id}`, body);
	return data;
};

export const deletePost = async (id) => {
	const { data } = await api.delete(`/api/v1/posts/${id}`);
	return data;
};
