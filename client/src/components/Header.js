'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

function Header() {
	const { user, logout } = useAuth();
	const pathname = usePathname();

	function RefeshButton() {
		const handleRefresh = () => {
			window.location.reload();
		};
	}

	const handleDiscover = (e) => {
		if (pathname === '/') {
			e.preventDefault();
			window.location.reload();
		}
	};

	return (
		<div>
			<header className="flex flex-row m-10 justify-between items-center">
				<Link
					href="/"
					onClick={handleDiscover}
					className="text-3xl font-bold flex flex-row items-center gap-2"
				>
					MuseFinder
				</Link>

				<div className="flex flex-row items-center">
					<Link
						href="/"
						className="text-xl font-bold ml-6"
						onClick={handleDiscover}
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
