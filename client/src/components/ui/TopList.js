'use client';
import React from 'react';

// one of the spotify top lists. artists get round images, tracks get
// their album art. each row opens on spotify
function TopList({ title, items = [], round = false }) {
	return (
		<section>
			<p className="text-xs tracking-widest text-gray-500">{title}</p>

			{items.length === 0 ? (
				<p className="mt-2 text-sm text-gray-500">Not enough listening yet.</p>
			) : (
				<ol className="mt-3 flex flex-col gap-3">
					{items.map((item, index) => {
						// tracks keep their art on item.album
						const image = (item.images ?? item.album?.images)?.[0]?.url;
						const subtitle = item.artists?.map((a) => a.name).join(', ');

						return (
							<li key={item.id}>
								<a
									href={item.external_urls?.spotify}
									target="_blank"
									rel="noreferrer"
									className="group flex items-center gap-3"
								>
									<span className="w-3 shrink-0 text-xs text-gray-600">
										{index + 1}
									</span>
									<div
										className={`h-9 w-9 shrink-0 overflow-hidden bg-[#1a1a1a] ${
											round ? 'rounded-full' : 'rounded'
										}`}
									>
										{image && (
											<img
												src={image}
												alt=""
												className="h-full w-full object-cover"
											/>
										)}
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm text-white group-hover:text-[#925FF0]">
											{item.name}
										</p>
										{subtitle && (
											<p className="truncate text-xs text-gray-500">
												{subtitle}
											</p>
										)}
									</div>
								</a>
							</li>
						);
					})}
				</ol>
			)}
		</section>
	);
}

export default TopList;
