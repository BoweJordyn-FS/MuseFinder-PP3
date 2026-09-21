'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Modal from './Modal';

const describe = (item) => {
	const images = item.images ?? item.album?.images ?? [];
	const artists = item.artists?.map((a) => a.name).join(', ');
	return {
		image: images[0]?.url,
		name: item.name,
		subtitle:
			item.type === 'artist'
				? item.genres?.slice(0, 2).join(' · ') || 'Artist'
				: artists,
	};
};

function ResultCard({ item }) {
	const { image, name, subtitle } = describe(item);
	const [open, setOpen] = useState(false);
	// only albums and tracks can be reviewed
	const reviewable = item.type === 'album' || item.type === 'track';
	const spotifyUrl = item.external_urls?.spotify;
	const card = (
		<motion.div
			className={`flex flex-col w-60 shrink-0 ${reviewable ? 'cursor-pointer' : ''}`}
			whileHover={reviewable ? { y: -4 } : undefined}
			onClick={reviewable ? () => setOpen(true) : undefined}
		>
			<div className="w-60 h-60 rounded-md overflow-hidden border border-gray-300 bg-white">
				{image ? (
					<img
						src={image}
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
	return (
		<>
			{reviewable ? (
				<div onClick={() => setOpen(true)}>{card}</div>
			) : (
				<a
					href={spotifyUrl}
					target="_blank"
					rel="noreferrer"
				>
					{card}
				</a>
			)}

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
