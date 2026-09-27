'use client';
import React from 'react';
import { useState } from 'react';
import {
	Rating,
	Menu,
	MenuDivider,
	Text,
	Textarea,
	MenuItem,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { Star1, Edit2, Trash, More } from 'iconsax-react';
import { deletePost, updatePost } from '../../services/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { errorMessage } from '@/lib/api';
import PlaylistPicker from './PlaylistPicker';

function relativeTime(iso, fallback) {
	if (!iso) return fallback ?? '';
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) return fallback ?? iso;

	const diff = Math.max(0, Date.now() - then);
	const sec = Math.floor(diff / 1000);
	if (sec < 10) return 'just now';
	if (sec < 60) return `${sec}s ago`;
	const min = Math.floor(sec / 60);
	if (min < 60) return `${min}m ago`;
	const hr = Math.floor(min / 60);
	if (hr < 24) return `${hr}h ago`;
	const day = Math.floor(hr / 24);
	if (day < 7) return `${day}d ago`;
	return new Date(then).toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
	});
}

function PostCard({ post }) {
	const queryClient = useQueryClient();
	const [editing, setEditing] = useState(false);
	const [ratingDraft, setRatingDraft] = useState(post?.rating ?? 0);
	const [draft, setDraft] = useState(post?.content ?? '');
	const [formError, setFormError] = useState(null);
	const [type, setType] = useState(true);
	const { subject, rating, content, createdAt } = post;

	const stopEditing = () => {
		setDraft(post.content ?? '');
		setRatingDraft(post.rating ?? 0);
		setFormError(null);
		setEditing(false);
	};

	const { mutate: doDelete, isPending: deleting } = useMutation({
		mutationFn: () => deletePost(post._id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
		onError: (error) =>
			modals.open({
				title: "Couldn't delete that post",
				centered: true,
				children: <Text size="sm">{errorMessage(error)}</Text>,
			}),
	});

	const { mutate: doUpdate, isPending: saving } = useMutation({
		mutationFn: () =>
			updatePost(post._id, { content: draft.trim(), rating: ratingDraft }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			setFormError(null);
			setEditing(false);
		},
		onError: (error) => setFormError(errorMessage(error)),
	});

	const save = () => {
		if (!draft.trim()) return setFormError('Write something first');
		if (post.type === 'review' && ratingDraft < 1) {
			return setFormError('Pick a star rating');
		}
		setFormError(null);
		doUpdate();
	};

	const confirmDelete = () =>
		modals.openConfirmModal({
			title: 'Delete this post?',
			children: (
				<Text
					size="sm"
					c="dimmed"
				>
					This will be gone forever. <i>Forever</i> forever.
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			centered: true,
			onConfirm: () => doDelete(),
		});

	return (
		<div
			id="post-card"
			className={`bg-[#10100E] rounded-2xl p-4 font-light flex flex-row gap-2 ${
				deleting ? 'opacity-50 pointer-events-none' : ''
			}`}
		>
			<div className="ml-5 flex-1">
				<div
					id="pc-header"
					className="flex flex-row gap-1 space-x-1.5 content-center"
				>
					<p className="text-sm font-extralight uppercase italic">
						{subject?.type ?? 'post'} ·{' '}
						<span className="text-gray-500 text-sm font-extralight italic normal-case">
							{relativeTime(createdAt)}
						</span>
					</p>
				</div>
				<div className="flex flex-row gap-4 mt-3 items-start">
					<div>
						{subject?.image_url ? (
							<img
								src={subject.image_url}
								alt={subject.name}
								className="w-50 h-50 rounded-lg object-cover shrink-0"
							/>
						) : (
							<div className="w-50 h-50 rounded-lg shrink-0 bg-white" />
						)}
					</div>
					<div className="flex flex-col flex-1 min-w-0 gap-0.5">
						<h4 className="text-xl font-medium text-white leading-tight">
							{subject?.name}
						</h4>
						<h5 className="text-lg text-gray-400 font-light">
							{subject?.artist}
						</h5>
						<Rating
							readOnly={!editing}
							count={5}
							value={editing ? ratingDraft : (rating ?? 0)}
							onChange={(v) => {
								setRatingDraft(v);
								setFormError(null);
							}}
							emptySymbol={
								<Star1
									size={20}
									variant="Broken"
									color="#925EF0"
								/>
							}
							fullSymbol={
								<Star1
									size={20}
									variant="Bold"
									color="#925EF0"
								/>
							}
						/>
						{editing ? (
							<div className="mt-1 flex flex-col gap-2">
								<Textarea
									autosize
									minRows={3}
									value={draft}
									onChange={(e) => {
										setDraft(e.currentTarget.value);
										setFormError(null);
									}}
									className="border border-[#925FF0] bg-[#1a1a1a] p-2 rounded-sm"
								/>
								{formError && (
									<p className="text-red-400 text-sm">{formError}</p>
								)}
								<div className="flex flex-row gap-3 items-center">
									<button
										type="button"
										onClick={save}
										disabled={saving}
										className="bg-[#E9DFFC] text-[#925FF0] px-4 py-1.5 rounded-md text-sm transition-colors hover:bg-[#925FF0] hover:text-[#E9DFFC] cursor-pointer disabled:opacity-50"
									>
										{saving ? 'Saving…' : 'Save'}
									</button>
									<button
										type="button"
										onClick={stopEditing}
										disabled={saving}
										className="text-sm text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<>
								<p className="mt-1 whitespace-pre-wrap">{content}</p>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-between">
				<Menu shadow="md">
					<Menu.Target>
						<button
							type="button"
							aria-label="Post options"
							className="self-start cursor-pointer"
						>
							<More
								size={22}
								color="white"
								className="rotate-90"
							/>
						</button>
					</Menu.Target>
					<Menu.Dropdown className="flex flex-col m-1">
						<div className="ml-2 gap-3 items-center">
							<Menu.Item
								onClick={() => {
									setDraft(post.content ?? '');
									setRatingDraft(post.rating ?? 0);
									setFormError(null);
									setEditing(true);
								}}
								leftSection={
									<Edit2
										size={18}
										color="#925FF0"
										variant="Broken"
									/>
								}
								className="m-1"
							>
								<Text size="sm">Edit</Text>
							</Menu.Item>
							<MenuDivider />
							<Menu.Item
								onClick={confirmDelete}
								disabled={deleting}
								leftSection={
									<Trash
										size={18}
										color="#D64751"
										variant="Broken"
									/>
								}
								className="m-1"
							>
								<Text size="sm">Delete</Text>
							</Menu.Item>
						</div>
					</Menu.Dropdown>
				</Menu>
				<div>
					<PlaylistPicker
						subject={subject}
						showText={false}
					/>
				</div>
			</div>
		</div>
	);
}

export default PostCard;
