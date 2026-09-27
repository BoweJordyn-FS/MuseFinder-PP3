'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSpotifyProfile } from '@/services/spotify';
import { Menu } from '@mantine/core';
import { Profile as ProfileIcon } from 'iconsax-react';

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
	const { data: profile } = useQuery({
		queryKey: ['spotify', 'me'],
		queryFn: getSpotifyProfile,
	});
	const avatar = profile?.images?.[0]?.url;

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

				<div className="flex flex-row items-center gap-6">
					<Link
						href="/"
						className="text-xl font-bold ml-6"
						onClick={handleDiscover}
					>
						Discover
					</Link>
					<Menu>
						<Menu.Target>
							<div>
								{avatar ? (
									<img
										src={avatar}
										alt={profile?.display_name ?? 'Profile photo'}
										className="w-12 h-12 object-cover rounded-full ring-2 ring-[#925FF0]"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<ProfileIcon
											size={34}
											variant="Broken"
											color="#925FF0"
										/>
									</div>
								)}
							</div>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item>
								<Link
									href="/profile"
									className="text-md hover:text-[#925FF0]"
								>
									Profile
								</Link>
							</Menu.Item>
							<Menu.Item>
								{user && (
									<button
										onClick={logout}
										className="text-md  hover:text-[#925FF0]"
									>
										Logout
									</button>
								)}
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</div>
			</header>
		</div>
	);
}

export default Header;
