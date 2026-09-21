'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Modal from './Modal';
import { toSubject } from '@/services/spotify';

function ResultCard({ item }) {
	const { image_url, name, subtitle, spotify_url } = toSubject(item);
	const [open, setOpen] = useState(false);
	// only albums and tracks can be reviewed, artists go to spotify
	const reviewable = item.type === 'album' || item.type === 'track';

	const card = (
		<motion.div
			className="flex flex-col w-60 shrink-0 cursor-pointer"
			whileHover={{ y: -4 }}
		>
			<div className="w-60 h-60 rounded-md overflow-hidden border border-gray-300 bg-white">
				{image_url ? (
					<img
						src={image_url}
						alt={name}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400">
						No image
					</div>
				)}
			</div>
			<p className="mt-2 font-bold truncate">{name}</p>
			<p className="text-sm text-gray-500 truncate">{subtitle}</p>
		</motion.div>
	);

	if (!reviewable) {
		return spotify_url ? (
			<a
				href={spotify_url}
				target="_blank"
				rel="noreferrer"
			>
				{card}
			</a>
		) : (
			card
		);
	}

	return (
		<>
			<div onClick={() => setOpen(true)}>{card}</div>

			{/* AnimatePresence out here so the close animation works */}
			<AnimatePresence>
				{open && (
					<Modal
						item={item}
						onClose={() => setOpen(false)}
					/>
				)}
			</AnimatePresence>
		</>
	);
}

export default ResultCard;
