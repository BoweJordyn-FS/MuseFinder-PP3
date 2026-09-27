import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// attach the jwt if there is one (localStorage only exists in the browser)
api.interceptors.request.use((config) => {
	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// the backend sends { error }, axios sends its own message for network stuff
export const errorMessage = (error) =>
	error?.response?.data?.error || error?.message || 'Something went wrong';

export default api;
