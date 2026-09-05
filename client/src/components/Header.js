import Link from 'next/link';
import React from 'react';

function Header() {
	return (
		<div>
			<header className="flex flex-row m-6 justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">MuseFinder</h1>
				</div>
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
				</div>
			</header>
		</div>
	);
}

export default Header;
