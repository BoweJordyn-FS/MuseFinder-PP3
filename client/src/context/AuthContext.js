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

	const signup = async (username, email, password) => {
		await auth.signup(username, email, password);
		setUser(await auth.me());
	};

	const login = async (email, password) => {
		await auth.login(email, password);
		setUser(await auth.me());
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
