'use client';
import React, { useState } from 'react';
import { Menu, MenuDivider, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Edit2, Trash, More, MusicLibrary2 } from 'iconsax-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePlaylist, updatePlaylist } from '@/services/playlists';

// fills the 2x2 cover grid, blanks out the slots with no art yet
const SLOTS = ['rounded-tl-md', 'rounded-tr-md', '', ''];

function PlaylistCard({ playlist, onOpen }) {
	const { _id, name, covers = [], itemCount = 0 } = playlist;
	const [renaming, setRenaming] = useState(false);
	const [draft, setDraft] = useState(name);
	const queryClient = useQueryClient();

	const refresh = () =>
		queryClient.invalidateQueries({ queryKey: ['playlists'] });

	const { mutate: doRename } = useMutation({
		mutationFn: (newName) => updatePlaylist(_id, { name: newName }),
		onSuccess: () => {
			refresh();
			setRenaming(false);
		},
	});

	const { mutate: doDelete } = useMutation({
		mutationFn: () => deletePlaylist(_id),
		onSuccess: refresh,
	});

	const submitRename = () => {
		const next = draft.trim();
		if (!next || next === name) return setRenaming(false);
		doRename(next);
	};

	const confirmDelete = () =>
		modals.openConfirmModal({
			title: `Delete "${name}"?`,
			children: (
				<Text
					size="sm"
					c="dimmed"
				>
					Your reviews stay on your profile, only the playlist goes.
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			centered: true,
			onConfirm: () => doDelete(),
		});

	return (
		<div className="grid grid-rows-4 border border-[#D9D9D930] rounded-md w-75 h-75 overflow-hidden">
			<button
				type="button"
				onClick={() => onOpen(playlist)}
				className="row-span-3 cursor-pointer"
			>
				<div className="grid grid-cols-2 grid-rows-2 gap-0 h-full">
					{SLOTS.map((corner, index) => (
						<div
							key={index}
							className={`bg-[#1a1a1a] ${corner} overflow-hidden`}
						>
							{covers[index] ? (
								<img
									src={covers[index]}
									alt=""
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<MusicLibrary2
										size={20}
										variant="Broken"
										color="#D9D9D930"
									/>
								</div>
							)}
						</div>
					))}
				</div>
			</button>

			<div className="row-span-1 bg-[#E9DFFC] text-black flex items-center justify-between px-3 gap-2">
				{renaming ? (
					<input
						autoFocus
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onBlur={submitRename}
						onKeyDown={(e) => {
							if (e.key === 'Enter') submitRename();
							if (e.key === 'Escape') {
								setDraft(name);
								setRenaming(false);
							}
						}}
						className="flex-1 min-w-0 border border-[#925FF0] rounded px-2 py-1 outline-none"
					/>
				) : (
					<button
						type="button"
						onClick={() => onOpen(playlist)}
						className="flex-1 min-w-0 text-left cursor-pointer"
					>
						<p className="font-medium truncate">{name}</p>
						<p className="text-xs text-gray-500">
							{itemCount} {itemCount === 1 ? 'album' : 'albums'}
						</p>
					</button>
				)}

				<Menu
					shadow="md"
					returnFocus={false}
				>
					<Menu.Target>
						<button
							type="button"
							title="Playlist options"
						>
							<More
								size={20}
								color="black"
								className="rotate-90"
							/>
						</button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item
							onClick={() => {
								setDraft(name);
								setRenaming(true);
							}}
							leftSection={
								<Edit2
									size={18}
									color="#925FF0"
									variant="Broken"
								/>
							}
						>
							<Text size="sm">Rename</Text>
						</Menu.Item>
						<MenuDivider />
						<Menu.Item
							onClick={confirmDelete}
							leftSection={
								<Trash
									size={18}
									color="#D64751"
									variant="Broken"
								/>
							}
						>
							<Text size="sm">Delete</Text>
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</div>
		</div>
	);
}

export default PlaylistCard;
