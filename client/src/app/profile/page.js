'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tabs } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import PostCard from '@/components/ui/PostCard';
import { useAuth } from '@/context/AuthContext';
import { getPostsByUser } from '@/services/posts';
import { errorMessage } from '@/lib/api';
import '@mantine/core/styles/Tabs.css';

function Profile() {
	const { user, loading } = useAuth();
	const router = useRouter();

	// my posts, refetches after the modal posts a new one
	const { data, isPending, error } = useQuery({
		queryKey: ['posts', { author: user?.user_id }],
		queryFn: () => getPostsByUser(user.user_id),
		enabled: Boolean(user),
	});
	const posts = data?.posts ?? [];

	// auth guard off while I work on the layout, turn back on later
	// useEffect(() => {
	//   if (!loading && !user) router.replace("/login");
	// }, [loading, user, router]);
	//
	// if (loading || !user) return null;

	return (
		<main className="grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-10 px-10 pb-10">
			{/* The wrapper is the sticky element, so both cards travel as one unit.
			    Sticking them individually made them overlap each other. */}
			<aside
				id="banner"
				className="flex flex-col gap-6 lg:sticky lg:top-10 lg:self-start"
			>
				<div className="bg-[#925FF0] text-center text-black rounded-xl p-8">
					<div className="bg-amber-50 rounded-full w-48 h-48 mx-auto mb-6" />
					<section className="mb-6">
						<h2 className="text-2xl font-medium">
							{user?.username ?? 'Username'}
						</h2>
						<h4 className="text-lg opacity-80">
							{user?.email ?? 'email@example.com'}
						</h4>
					</section>
					<section>
						<p className="leading-relaxed">
							Mollit ea dolor in enim esse officia reprehenderit ut et
							reprehenderit sit occaecat anim.
						</p>
					</section>

					<button className="bg-[#10100E] text-white rounded-md px-10 py-2 mt-8 transition-colors hover:bg-[#E9DFFC] hover:text-[#925FF0]">
						Edit Profile
					</button>
				</div>
				<section className="bg-[#925FF0] text-black rounded-xl p-8">
					<div
						id="usersTop"
						className="grid grid-cols-2 gap-6"
					>
						<div>
							<h3 className="text-lg font-semibold mb-2">Top Artists</h3>
							<ol className="list-decimal list-inside space-y-1 opacity-90">
								<li>one</li>
								<li>two</li>
								<li>three</li>
							</ol>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2">Top Songs</h3>
							<ol className="list-decimal list-inside space-y-1 opacity-90">
								<li>one</li>
								<li>two</li>
								<li>three</li>
							</ol>
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
						{error && (
							<p className="text-red-500">{errorMessage(error)}</p>
						)}
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
						<p>Playlists content goes here.</p>
					</Tabs.Panel>
				</Tabs>
			</section>
		</main>
	);
}

export default Profile;
