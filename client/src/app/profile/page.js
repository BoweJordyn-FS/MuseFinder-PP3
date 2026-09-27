'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tabs, Marquee } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import PostCard from '@/components/ui/PostCard';
import RatingBreakdown from '@/components/ui/RatingBreakdown';
import { useAuth } from '@/context/AuthContext';
import { getPostsByUser } from '@/services/posts';
import {
	getSpotifyProfile,
	getTopArtists,
	getTopTracks,
} from '@/services/spotify';
import { getPlaylists } from '@/services/playlists';

import { errorMessage } from '@/lib/api';
import { Location, Profile as ProfileIcon, ExportSquare } from 'iconsax-react';
import '@mantine/core/styles/Tabs.css';
import PlaylistsPanel from '@/components/PlaylistsPanel';

function Profile() {
	const { user, loading } = useAuth();
	const router = useRouter();

	// my posts, refetches after the modal posts a new one
	const { data, isPending, error } = useQuery({
		queryKey: ['posts', { author: user?.user_id }],
		queryFn: () => getPostsByUser(user.user_id),
		enabled: Boolean(user),
	});
	const { data: profile } = useQuery({
		queryKey: ['spotify', 'me'],
		queryFn: getSpotifyProfile,
	});

	const { data: playlists = [] } = useQuery({
		queryKey: ['playlists'],
		queryFn: getPlaylists,
	});

	const { data: topArtists = [] } = useQuery({
		queryKey: ['spotify', 'top', 'artists'],
		queryFn: () => getTopArtists(3),
	});

	const { data: topTracks = [] } = useQuery({
		queryKey: ['spotify', 'top', 'tracks'],
		queryFn: () => getTopTracks(3),
	});

	const posts = data?.posts ?? [];
	const avatar = profile?.images?.[0]?.url;

	useEffect(() => {
		if (!loading && !user) router.replace('/login');
	}, [loading, user, router]);

	if (loading || !user) return null;

	return (
		<main className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-10 px-10 pb-10">
			<aside
				id="banner"
				className="flex flex-col gap-6 lg:sticky lg:top-10 lg:self-start"
			>
				<div className="relative overflow-hidden rounded-2xl border border-[#925FF0BF] bg-[#10100E] shadow-lg shadow-black/40">
					<div className="h-24 bg-linear-to-br from-[#925FF0] via-[#6E3FC4] to-[#10100E]" />
					<div className="-mt-12 flex flex-col items-center px-6 pb-6 text-center">
						<div className="h-24 w-24 overflow-hidden rounded-full bg-[#1a1a1a] ring-4 ring-[#10100E] shadow-lg shadow-black/50">
							{avatar ? (
								<img
									src={avatar}
									alt={profile?.display_name ?? 'Profile photo'}
									className="h-full w-full object-cover"
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

						<section className="mt-4 flex flex-col items-center gap-1">
							<h2 className="text-2xl font-medium leading-tight text-white">
								{profile?.display_name ?? 'Username'}
							</h2>
							{profile?.country && (
								<p className="flex items-center gap-1.5 text-sm font-light text-gray-400">
									<Location
										size={16}
										color="#925FF0"
										variant="Broken"
									/>
									{profile.country}
								</p>
							)}
						</section>

						<section className="mt-6 grid w-full grid-cols-2 divide-x divide-[#D9D9D930] border-t border-[#D9D9D930] pt-4">
							<div className="flex flex-col gap-0.5">
								<h3 className="text-xl font-semibold text-white">
									{posts.length}
								</h3>
								<h4 className="text-[11px] uppercase tracking-wider text-gray-500">
									Reviews
								</h4>
							</div>
							<div className="flex flex-col gap-0.5">
								<h3 className="text-xl font-semibold text-white">
									{playlists.length}
								</h3>
								<h4 className="text-[11px] uppercase tracking-wider text-gray-500">
									Playlists
								</h4>
							</div>
						</section>
						<section className="border-t border-[#D9D9D930] w-full mt-6">
							<p className="mt-4 text-left text-xs tracking-widest text-gray-500">
								RATINGS
							</p>
							<RatingBreakdown posts={posts} />
						</section>

						{profile?.external_urls?.spotify && (
							<a
								href={profile.external_urls.spotify}
								target="_blank"
								rel="noreferrer"
								className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-md border border-[#925FF0]/40 bg-[#925FF0]/10 px-3 py-1.5 text-sm text-[#C4A6FF] transition-colors hover:bg-[#925FF0] hover:text-white"
							>
								Open in Spotify
								<ExportSquare
									size={16}
									variant="Broken"
									color="currentColor"
								/>
							</a>
						)}
					</div>
				</div>
				<section className="rounded-2xl border border-[#10100e31] bg-[#10100E] shadow-lg shadow-black/40 p-4">
					<div
						id="usersTop"
						className="flex flex-col gap-6"
					>
						<div>
							<h3 className="text-left text-sm font-bold tracking-widest text-[#925FF0BF]">
								TOP ARTISTS
							</h3>
							{topArtists.length === 0 ? (
								<p className="text-sm opacity-70">Not enough listening yet.</p>
							) : (
								<ol className="space-y-1 opacity-90">
									{topArtists.map((artist, index) => (
										<li
											key={artist.id}
											className="flex flex-row gap-2 text-sm"
										>
											<span className="shrink-0 tabular-nums opacity-70">
												{index + 1}.
											</span>
											<span className="truncate">{artist.name}</span>
										</li>
									))}
								</ol>
							)}
						</div>
						<div>
							<h3 className="text-left text-sm font-bold tracking-widest text-[#925FF0BF]">
								TOP SONGS
							</h3>
							{topTracks.length === 0 ? (
								<p className="text-sm opacity-70">Not enough listening yet.</p>
							) : (
								<ol className="space-y-1 opacity-90">
									{topTracks.map((track, index) => (
										<li
											key={track.id}
											className="my-2 flex flex-row gap-2 text-sm"
										>
											<span className="shrink-0 tabular-nums opacity-70">
												{index + 1}.
											</span>
											<div className="min-w-0 flex-1">
												<Marquee
													fadeEdges={true}
													fadeEdgeColor="#10100E"
													repeat={5}
													pauseOnHover={true}
													duration={90000}
												>
													{track.name}
													<span className="opacity-70">
														{' '}
														— {track.artists?.map((a) => a.name).join(', ')}
													</span>
												</Marquee>
											</div>
										</li>
									))}
								</ol>
							)}
						</div>
					</div>
				</section>
			</aside>

			<section className="min-w-0">
				<Tabs
					defaultValue="profile"
					color="violet"
					variant="pills"
					radius="xl"
				>
					<Tabs.List className="font-bold text-lg">
						<Tabs.Tab value="profile">Profile</Tabs.Tab>
						<Tabs.Tab value="playlists">Playlists</Tabs.Tab>
					</Tabs.List>
					<hr className="my-6 h-px border-0 bg-linear-to-r from-transparent via-[#925FF0]/75 to-transparent" />
					{/* PROFILE PANEL */}
					<Tabs.Panel
						value="profile"
						className="flex flex-col gap-6"
					>
						{!user && !loading && (
							<p className="text-gray-500">
								<Link
									href="/login"
									className="text-[#925FF0] hover:underline"
								>
									Log in
								</Link>{' '}
								to see your reviews.
							</p>
						)}
						{user && isPending && <p className="text-gray-500">Loading…</p>}
						{error && <p className="text-red-500">{errorMessage(error)}</p>}
						{user && !isPending && posts.length === 0 && (
							<p className="text-gray-500">
								No reviews yet. Search for an album or track to write one.
							</p>
						)}
						{posts.map((post) => (
							<PostCard
								key={post._id}
								post={post}
							/>
						))}
					</Tabs.Panel>

					<Tabs.Panel value="playlists">
						<PlaylistsPanel />
					</Tabs.Panel>
				</Tabs>
			</section>
		</main>
	);
}

export default Profile;
