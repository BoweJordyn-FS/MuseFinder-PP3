'use client';
import { useState } from 'react';
import { Popover } from '@mantine/core';
import { HeartAdd, Add, TickCircle } from 'iconsax-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlaylists, createPlaylist, addItem } from '@/services/playlists';
import { errorMessage } from '@/lib/api';

// saves an album/track to one of the user's playlists
export default function PlaylistPicker({ subject, showText = true }) {
	const [open, setOpen] = useState(false);
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [added, setAdded] = useState(null);
	const [error, setError] = useState(null);
	const queryClient = useQueryClient();

	const { data: playlists = [] } = useQuery({
		queryKey: ['playlists'],
		queryFn: getPlaylists,
		enabled: open,
	});

	const { mutate: doAdd } = useMutation({
		mutationFn: (playlistId) => addItem(playlistId, subject),
		onSuccess: (_, playlistId) => {
			queryClient.invalidateQueries({ queryKey: ['playlists'] });
			setError(null);
			setAdded(playlistId);
			setTimeout(() => {
				setAdded(null);
				setOpen(false);
			}, 1200);
		},
		onError: (err) => setError(errorMessage(err)),
	});

	// new playlist, then drop the album straight into it
	const { mutate: doCreate } = useMutation({
		mutationFn: (name) => createPlaylist({ name }),
		onSuccess: (playlist) => {
			queryClient.invalidateQueries({ queryKey: ['playlists'] });
			setCreating(false);
			setNewName('');
			doAdd(playlist._id);
		},
	});

	const handleCreate = (e) => {
		e.preventDefault();
		if (!newName.trim()) return;
		doCreate(newName.trim());
	};

	return (
		<Popover
			opened={open}
			onChange={setOpen}
			position="top-start"
			width={250}
		>
			<Popover.Target>
				<button
					type="button"
					aria-label="Save to playlist"
					className="text-[#925FF0] hover:text-[#E9DFFC] py-2 rounded-md flex flex-row gap-2 cursor-pointer"
					onClick={() => {
						setOpen((o) => !o);
						setCreating(false);
						setError(null);
					}}
				>
					<HeartAdd
						size={20}
						color="#925FF0"
						className="hover:text-[#E9DFFC]"
					/>
					{showText && <span>Save to Playlist</span>}
				</button>
			</Popover.Target>

			<Popover.Dropdown>
				<p className="text-xs text-gray-400 mb-2 px-1">Your playlists</p>

				{playlists.length === 0 && !creating && (
					<p className="text-xs text-gray-500 px-1 mb-2">No playlists yet.</p>
				)}

				{playlists.map((pl) => (
					<button
						key={pl._id}
						type="button"
						onClick={() => doAdd(pl._id)}
						className="w-full text-left text-sm text-white px-2 py-1.5 rounded-md hover:bg-[#925FF020] flex justify-between items-center"
					>
						<span className="truncate">{pl.name}</span>
						{added === pl._id && (
							<TickCircle
								size={14}
								color="#B5FDB4"
								variant="Bold"
							/>
						)}
					</button>
				))}

				{error && <p className="text-xs text-red-400 px-1 mt-1">{error}</p>}

				{creating ? (
					<form
						onSubmit={handleCreate}
						className="mt-2 flex gap-1"
					>
						<input
							autoFocus
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							placeholder="Playlist name"
							className="flex-1 bg-[#10100E] border border-[#D9D9D930] text-white text-xs rounded px-2 py-1 outline-none"
						/>
						<button
							type="submit"
							className="text-xs text-[#925FF0] hover:text-white px-1"
						>
							add
						</button>
					</form>
				) : (
					<button
						type="button"
						onClick={() => setCreating(true)}
						className="mt-1 w-full text-left text-xs text-[#925FF0] hover:text-white px-2 py-1.5 flex items-center gap-1"
					>
						<Add
							size={14}
							color="white"
						/>{' '}
						New playlist
					</button>
				)}
			</Popover.Dropdown>
		</Popover>
	);
}
