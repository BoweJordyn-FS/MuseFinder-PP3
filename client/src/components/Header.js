'use client';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

function Header() {
	const { user, logout } = useAuth();

	return (
		<div>
			<header className="flex flex-row m-10 justify-between items-center">
				<h1 className="text-3xl font-bold flex flex-row items-center gap-2">
					MuseFinder
				</h1>

				<div className="flex flex-row items-center">
					<Link
						href="/"
						className="text-xl font-bold ml-6"
					>
						Discover
					</Link>
					<Link
						href="/profile"
						className="text-xl font-bold ml-6"
					>
						Profile
					</Link>
					{user && (
						<button
							onClick={logout}
							className="text-xl font-bold ml-6 hover:text-[#925FF0]"
						>
							Logout
						</button>
					)}
				</div>
			</header>
		</div>
	);
}

export default Header;
