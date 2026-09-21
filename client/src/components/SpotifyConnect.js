'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// pages you can see without connecting spotify
const OPEN = ['/login', '/signup', '/connect'];

// logged in but no spotify yet -> send them to /connect
function SpotifyConnect({ children }) {
	const { user, loading } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	const needsConnect =
		!loading && user && !user.spotify_connected && !OPEN.includes(pathname);

	useEffect(() => {
		if (needsConnect) router.replace('/connect');
	}, [needsConnect, router]);

	if (needsConnect) return null;
	return children;
}

export default SpotifyConnect;
