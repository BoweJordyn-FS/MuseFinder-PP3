'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Rating, Textarea, Group, Badge, Loader } from '@mantine/core';
import { Star1, TickCircle, PlayCircle } from 'iconsax-react';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/services/posts';
import PlaylistPicker from './PlaylistPicker';
import { toSubject } from '@/services/spotify';
import { useAuth } from '@/context/AuthContext';
import { errorMessage } from '@/lib/api';

// review modal for an album or track
function Modal({ item, onClose }) {
	const { user } = useAuth();
	// login check off for now, put `user` back here when auth is on
	const canReview = true; // user
	const queryClient = useQueryClient();
	const subject = toSubject(item);

	const [rating, setRating] = useState(0);
	const [ratingError, setRatingError] = useState(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { review: '' },
		validate: {
			review: (v) => (v.trim() ? null : 'Write something first'),
		},
	});

	const { mutate, isPending, error } = useMutation({
		mutationFn: createPost,
		onSuccess: () => {
			// refetch posts so the profile updates
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			// Show the success animation, then close after a short beat.
			setShowSuccess(true);
			setTimeout(() => {
				setShowSuccess(false);
				form.reset();
				setRating(0);
				onClose();
			}, 1200);
		},
	});

	const handleSubmit = form.onSubmit(({ review }) => {
		if (rating < 1) {
			setRatingError('Pick a star rating');
			return;
		}
		setRatingError(null);
		mutate({
			type: 'review',
			content: review.trim(),
			rating,
			subject,
		});
	});

	const handleClose = () => {
		if (isPending) return;
		form.reset();
		setRating(0);
		onClose();
	};

	useEffect(() => {
		const onKey = (e) => e.key === 'Escape' && handleClose();
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [isPending]);

	const year = subject.release_date?.slice(0, 4);

	return (
		<motion.div
			className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={handleClose}
		>
			<motion.div
				onClick={(e) => e.stopPropagation()}
				initial={{ scale: 0.95, y: 8 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.95, y: 8 }}
				className="bg-[#10100E] shadow-2xl shadow-amber-50/10 rounded-2xl p-6 sm:p-8 w-100 max-w-md max-h-[90vh] overflow-y-auto relative"
			>
				{/* Posting / success overlay */}
				<AnimatePresence>
					{(isPending || showSuccess) && (
						<motion.div
							key="overlay"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-[#10100E]/95 flex flex-col items-center justify-center gap-3 z-10 rounded-2xl"
						>
							{showSuccess ? (
								<motion.div
									initial={{ scale: 0.4, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ type: 'spring', stiffness: 260, damping: 18 }}
								>
									<TickCircle
										size={72}
										variant="Bold"
										color="#925EF0"
									/>
								</motion.div>
							) : (
								<Loader
									color="violet"
									size="lg"
								/>
							)}
							<p className="text-white text-sm font-medium">
								{showSuccess ? 'Posted!' : 'Posting your review…'}
							</p>
						</motion.div>
					)}
				</AnimatePresence>

				<div
					id="modal-header"
					className="flex flex-row gap-4 mb-6"
				>
					<div
						id="container"
						className="group relative w-28 h-28 shrink-0 cursor-pointer"
					>
						{subject.image_url ? (
							<img
								src={subject.image_url}
								alt={subject.name}
								className="w-full h-full rounded-lg object-cover transition duration-300 group-hover:brightness-50"
							/>
						) : (
							<div className="w-full h-full rounded-lg bg-white transition duration-300 group-hover:brightness-50" />
						)}
						{subject.spotify_url && (
							<a
								id="hover"
								href={subject.spotify_url}
								target="_blank"
								rel="noreferrer"
								aria-label="Open in Spotify"
								className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 transition duration-300 group-hover:opacity-100 group-hover:scale-100"
							>
								<PlayCircle
									color="#925EF0"
									size={56}
									variant="Bold"
								/>
							</a>
						)}
					</div>
					<div className="flex flex-col justify-center gap-1 min-w-0">
						<h3 className="text-white text-lg font-medium leading-tight truncate">
							{subject.name}
						</h3>
						<p className="text-gray-400 text-sm truncate">{subject.artist}</p>
						<div className="flex flex-row flex-wrap gap-1 mt-1">
							<Badge
								size="xs"
								variant="default"
								className="p-1"
							>
								{subject.type}
							</Badge>
							{year && (
								<Badge
									size="xs"
									variant="default"
									className="p-1"
								>
									{year}
								</Badge>
							)}
						</div>
					</div>
				</div>

				{canReview ? (
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<div>
							<Rating
								emptySymbol={
									<Star1
										size={20}
										variant="Broken"
										color="#925EF0"
									/>
								}
								fullSymbol={
									<Star1
										size={24}
										variant="Bold"
										color="#925EF0"
									/>
								}
								count={5}
								value={rating}
								onChange={(v) => {
									setRating(v);
									setRatingError(null);
								}}
							/>
							{ratingError && (
								<p className="text-red-400 text-sm mt-1">{ratingError}</p>
							)}
						</div>
						<Textarea
							placeholder="What are your thoughts..."
							autosize
							minRows={4}
							key={form.key('review')}
							{...form.getInputProps('review')}
							className="border border-[#925FF0] bg-[#1a1a1a] p-2 rounded-sm"
						/>
						{error && (
							<p className="text-red-400 text-sm">{errorMessage(error)}</p>
						)}
						<Group justify="space-between">
							<PlaylistPicker subject={subject} />
							<button
								type="submit"
								disabled={isPending}
								className="bg-[#E9DFFC] text-[#925FF0] px-5 py-2 rounded-md font-light transition-colors hover:bg-[#925FF0] hover:text-[#E9DFFC] cursor-pointer disabled:opacity-50"
							>
								Post
							</button>
						</Group>
					</form>
				) : (
					<p className="text-gray-300 text-sm">
						<Link
							href="/login"
							className="text-[#925FF0] hover:underline"
						>
							Log in
						</Link>{' '}
						to review this {subject.type}.
					</p>
				)}
			</motion.div>
		</motion.div>
	);
}

export default Modal;
