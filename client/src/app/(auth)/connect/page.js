'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { errorMessage } from '@/lib/api';

// after signup/login the user lands here until they connect spotify
function Connect() {
	const { user, loading, connectSpotify } = useAuth();
	const router = useRouter();
	const [error, setError] = useState(null);
	const [isConnecting, setIsConnecting] = useState(false);

	// /callback sends us back here with ?error= if something went wrong
	useEffect(() => {
		const err = new URLSearchParams(window.location.search).get('error');
		if (err === 'access_denied') setError('You need to allow access on Spotify.');
		else if (err) setError('Something went wrong, try again.');
	}, []);

	// not logged in -> login. already connected -> home
	useEffect(() => {
		if (loading) return;
		if (!user) router.replace('/login');
		else if (user.spotify_connected) router.replace('/');
	}, [loading, user, router]);

	const handleConnect = async () => {
		setIsConnecting(true);
		setError(null);
		try {
			await connectSpotify();
		} catch (err) {
			setError(errorMessage(err));
			setIsConnecting(false);
		}
	};

	if (loading || !user) return null;

	return (
		<main className="flex flex-1 flex-col justify-center p-6 sm:p-10">
			<div className="mx-auto w-full max-w-md text-black">
				<h1 className="text-3xl font-bold">Connect Spotify</h1>
				<p className="mt-6 text-gray-600">
					MuseFinder uses your Spotify account to find what you listen to.
				</p>
				{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
				<button
					onClick={handleConnect}
					disabled={isConnecting}
					className="bg-black rounded-full p-2 text-white w-full mt-6 hover:bg-[#925FF0] disabled:opacity-50"
				>
					{isConnecting ? 'Sending you to Spotify…' : 'Connect Spotify'}
				</button>
			</div>
		</main>
	);
}

export default Connect;
