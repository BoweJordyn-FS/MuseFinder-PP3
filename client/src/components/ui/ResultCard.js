import React from 'react';

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
	return (
		<div className="flex flex-col w-60 shrink-0">
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
		</div>
	);
}

export default ResultCard;
