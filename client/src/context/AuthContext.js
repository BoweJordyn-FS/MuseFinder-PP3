'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as auth from '@/services/auth';
import { getConnectUrl } from '@/services/spotify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!localStorage.getItem('token')) return setLoading(false);
		auth
			.me()
			.then(setUser)
			.catch(() => auth.logout())
			.finally(() => setLoading(false));
	}, []);

	// login and signup both return the user now, no second /me call needed
	const signup = async (email, password) => {
		const { token, ...me } = await auth.signup(email, password);
		setUser(me);
		return me;
	};

	const login = async (email, password) => {
		const { token, ...me } = await auth.login(email, password);
		setUser(me);
		return me;
	};

	const logout = () => {
		auth.logout();
		setUser(null);
		// everything cached is this user's, don't leave it for the next one
		queryClient.clear();
	};

	// sends the browser to spotify's consent screen, comes back via /callback
	const connectSpotify = async () => {
		window.location.href = await getConnectUrl();
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, signup, login, logout, connectSpotify }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
