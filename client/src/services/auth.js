import api from '@/lib/api';

export const signup = async (username, email, password) => {
	const { data } = await api.post('/api/v1/auth/signup', {
		username,
		email,
		password,
	});
	localStorage.setItem('token', data.token);
	return data;
};

export const login = async (email, password) => {
	const { data } = await api.post('/api/v1/auth/login', { email, password });
	localStorage.setItem('token', data.token);
	return data;
};

export const logout = () => localStorage.removeItem('token');

export const me = async () => {
	const { data } = await api.get('/api/v1/auth/me');
	return data;
};
