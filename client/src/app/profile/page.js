'use client';
import React from 'react';
import { Tabs, Progress, Rating } from '@mantine/core';
import PostCard from '@/components/ui/PostCard';
import '@mantine/core/styles/Tabs.css';

function Profile() {
	return (
		<main className="grid grid-cols-4">
			<aside id="banner">
				<div
					className="bg-[#925FF0] h-auto w-80 text-center text-black rounded-xl ml-5
			 mt-5 p-4"
				>
					<div className="flex self-center bg-amber-50 rounded-full w-50 h-50 mt-14 mb-8 ml-11 " />
					<section className="mb-8">
						<h2 className="text-2xl">Jordyn</h2>
						<h4 className="text-xl">@jordynbowe</h4>
					</section>
					<section>
						<p>
							Mollit ea dolor in enim esse officia reprehenderit ut et
							reprehenderit sit occaecat anim. Sint labore consectetur cillum
							aliquip quis ipsum adipisicing Lorem tempor elit veniam deserunt
							in.
						</p>
					</section>
					{/* <section className="flex flex-row justify-between m-5">
						<div>
							<h3 className="text-xl">0</h3>
							<h4 className="text-lg">Reviews</h4>
						</div>
						<div>
							<h3 className="text-xl">0</h3>
							<h4 className="text-lg">Avg Rating</h4>
						</div>
						<div>
							<h3 className="text-xl">0</h3>
							<h4 className="text-lg">Playlists</h4>
						</div>
					</section> */}
					<button className=" bg-[#10100E] text-white rounded-md px-10 py-2 mt-8">
						Edit Profile
					</button>
				</div>
			</aside>

			<section className="col-span-3">
				<Tabs
					defaultValue="profile"
					color="violet"
					variant="pills"
					radius="xl"
					justify="flex-end"
				>
					<Tabs.List className="m-5 font-bold text-lg">
						<Tabs.Tab value="profile">Profile</Tabs.Tab>
						<Tabs.Tab value="playlists">Playlists</Tabs.Tab>
					</Tabs.List>
					<hr className="m-5 h-px border-0 bg-linear-to-r from-transparent via-[#925FF0]/75 to-transparent" />
					{/* PROFILE PANEL */}
					<Tabs.Panel
						value="profile"
						className="mt-8"
					>
						{Array.from({ length: 6 }).map((_, index) => (
							<PostCard key={index} />
						))}
					</Tabs.Panel>

					<Tabs.Panel
						value="playlists"
						className="mt-8"
					>
						<p>Playlists content goes here.</p>
					</Tabs.Panel>
				</Tabs>
			</section>
		</main>
	);
}

export default Profile;
