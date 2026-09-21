'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '@/services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!localStorage.getItem('token')) return setLoading(false);
		auth
			.me()
			.then(setUser)
			.catch(() => auth.logout())
			.finally(() => setLoading(false));
	}, []);

	// login and signup both return the user now, no second /me call needed
	const signup = async (username, email, password) => {
		const { token, ...me } = await auth.signup(username, email, password);
		setUser(me);
	};

	const login = async (email, password) => {
		const { token, ...me } = await auth.login(email, password);
		setUser(me);
	};

	const logout = () => {
		auth.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, signup, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
