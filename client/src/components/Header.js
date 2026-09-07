import Link from 'next/link';
import React from 'react';

function Header() {
	return (
		<div>
			<header className="flex flex-row m-10 justify-between items-center">
				<h1 className="text-3xl font-bold flex flex-row items-center gap-2">
					MuseFinder
				</h1>

				<div>
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
					<Link
						href="/playlists"
						className="text-xl font-bold ml-6"
					>
						Playlists
					</Link>
				</div>
			</header>
		</div>
	);
}

export default Header;
