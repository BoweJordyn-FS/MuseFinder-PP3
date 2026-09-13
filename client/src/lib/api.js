import axios from 'axios';

// One axios instance for the whole app, pointed at the Express server.
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default api;
