'use client';
import React, { useState } from 'react';
import { Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Add, Trash, PlayCircle, ArrowCircleRight } from 'iconsax-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
	getPlaylists,
	getPlaylist,
	createPlaylist,
	removeItem,
} from '@/services/playlists';
import PlaylistCard from '@/components/ui/PlaylistCard';
import { errorMessage } from '@/lib/api';

// the playlists tab on the profile
function PlaylistsPanel() {
	const [createOpen, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);
	const [newName, setNewName] = useState('');
	const [openId, setOpenId] = useState(null);
	const queryClient = useQueryClient();

	const {
		data: playlists = [],
		isPending,
		error,
	} = useQuery({
		queryKey: ['playlists'],
		queryFn: getPlaylists,
	});

	// the one the user clicked, with its albums and any review ids
	const { data: openPlaylist } = useQuery({
		queryKey: ['playlists', openId],
		queryFn: () => getPlaylist(openId),
		enabled: Boolean(openId),
	});

	const refresh = () =>
		queryClient.invalidateQueries({ queryKey: ['playlists'] });

	const { mutate: doCreate, isPending: creating } = useMutation({
		mutationFn: (name) => createPlaylist({ name }),
		onSuccess: () => {
			refresh();
			setNewName('');
			closeCreate();
		},
	});

	const { mutate: doRemoveItem } = useMutation({
		mutationFn: ({ playlistId, spotifyId }) =>
			removeItem(playlistId, spotifyId),
		onSuccess: refresh,
	});

	const handleCreate = (e) => {
		e.preventDefault();
		if (!newName.trim()) return;
		doCreate(newName.trim());
	};

	return (
		<div>
			<div className="flex justify-start">
				<button
					type="button"
					onClick={openCreate}
					className="flex items-center gap-1 text-sm text-[#5E3A9E] hover:text-white px-3 py-1.5 rounded-md border border-[#5E3A9E]/40 bg-[#E9DFFC] hover:bg-[#5E3A9E]/10 transition-colors focus:outline-3 focus:outline-offset-2 focus:outline-[#5E3A9E]"
				>
					<Add
						size={18}
						color="#925FF0"
					/>
					New playlist
				</button>
			</div>

			{isPending && <p className="mt-5 text-sm text-gray-400">Loading…</p>}
			{error && <p className="mt-5 text-sm text-red-500">{errorMessage(error)}</p>}
			{!isPending && playlists.length === 0 && (
				<p className="mt-5 text-sm text-gray-400">
					No playlists yet. Save an album from search to get started.
				</p>
			)}

			<section className="mt-5 flex flex-wrap gap-6">
				{playlists.map((playlist) => (
					<PlaylistCard
						key={playlist._id}
						playlist={playlist}
						onOpen={() => setOpenId(playlist._id)}
					/>
				))}
			</section>

			{/* what's inside a playlist */}
			<Modal
				opened={Boolean(openId)}
				onClose={() => setOpenId(null)}
				title={openPlaylist?.name ?? 'Playlist'}
			>
				{!openPlaylist && <p className="text-sm text-gray-400">Loading…</p>}
				{openPlaylist?.items.length === 0 && (
					<p className="text-sm text-gray-500">Nothing in here yet.</p>
				)}
				<div className="flex flex-col gap-3">
					{openPlaylist?.items.map((item) => (
						<div
							key={item.spotify_id}
							className="flex items-center gap-3"
						>
							{/* cover, hover it to open the album on spotify */}
							<a
								href={item.spotify_url}
								target="_blank"
								rel="noreferrer"
								title="Play on Spotify"
								className="group relative w-10 h-10 shrink-0"
							>
								{item.image_url ? (
									<img
										src={item.image_url}
										alt=""
										className="w-full h-full rounded object-cover transition duration-300 group-hover:brightness-50"
									/>
								) : (
									<div className="w-full h-full rounded bg-[#1a1a1a]" />
								)}
								<span className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 transition duration-300 group-hover:opacity-100 group-hover:scale-100">
									<PlayCircle
										color="#925EF0"
										size={24}
										variant="Bold"
									/>
								</span>
							</a>

							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">{item.name}</p>
								<p className="text-xs text-gray-400 truncate">{item.artist}</p>
							</div>

							{/* only there if they actually reviewed it */}
							{item.review_id && (
								<Link
									href={`/posts/${item.review_id}`}
									title="See your review"
									className="text-white/70 hover:text-[#925FF0] p-1"
								>
									<ArrowCircleRight
										size={18}
										variant="Broken"
										color="currentColor"
									/>
								</Link>
							)}

							<button
								type="button"
								onClick={() =>
									doRemoveItem({
										playlistId: openId,
										spotifyId: item.spotify_id,
									})
								}
								className="text-white/70 hover:text-[#D64751] p-1"
								title="Remove from playlist"
							>
								<Trash
									size={16}
									variant="Broken"
									color="white"
								/>
							</button>
						</div>
					))}
				</div>
			</Modal>

			{/* new playlist */}
			<Modal
				opened={createOpen}
				onClose={closeCreate}
				title="New Playlist"
			>
				<form
					onSubmit={handleCreate}
					className="flex flex-col gap-3"
				>
					<input
						autoFocus
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder="Playlist name"
						className="bg-[#1a1a1a] border border-[#D9D9D930] text-white rounded-md px-3 py-2 outline-none focus:border-[#925FF0]"
					/>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={closeCreate}
							className="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!newName.trim() || creating}
							className="px-3 py-1.5 rounded-md text-sm bg-[#925FF0] text-white hover:bg-[#7d4ed4] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{creating ? 'Creating…' : 'Create'}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
}

export default PlaylistsPanel;
