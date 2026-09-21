'use client';
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import * as motion from 'motion/react-client';
import { Group, Scroller } from '@mantine/core';
import { BsSoundwave } from 'react-icons/bs';
import { ArrowCircleRight } from 'iconsax-react';
import { search } from '@/services/spotify';
import { errorMessage } from '@/lib/api';
import ResultCard from '@/components/ui/ResultCard';

const ROWS = [
	{ key: 'artists', title: 'Artists' },
	{ key: 'albums', title: 'Albums' },
	{ key: 'tracks', title: 'Tracks' },
];

function SearchResults({ q }) {
	const {
		data: results,
		isPending,
		error,
	} = useQuery({
		queryKey: ['search', q],
		queryFn: () => search(q),
		enabled: Boolean(q),
	});

	if (!q) return null;
	if (error) {
		return (
			<p className="p-10 text-red-600">{errorMessage(error)}</p>
		);
	}
	if (isPending) return <p className="p-10 text-gray-500">Searching…</p>;

	return (
		<motion.div
			className="w-full"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', bounce: 0.2 }}
		>
			<section className="p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10 flex flex-col gap-20">
				{ROWS.map(({ key, title }) => (
					<article key={key}>
						<div className="border-b-2 border-[#925FF0] mb-10">
							<Link
								href={`/results/${key}?q=${encodeURIComponent(q)}`}
								className="text-3xl font-bold text-[#925FF0] hover:underline flex flex-row gap-2 items-center"
							>
								{title}{' '}
								<ArrowCircleRight
									variant="broken"
									size={24}
									color="#925FF0"
								/>
							</Link>
						</div>
						{results[key].items.length === 0 ? (
							<p className="text-gray-500">No {key} found.</p>
						) : (
							<Scroller
								draggable
								edgeGradientColor="transparent"
								startControlIcon={<BsSoundwave size={20} />}
								endControlIcon={<BsSoundwave size={20} />}
							>
								<Group
									gap="md"
									wrap="nowrap"
								>
									{results[key].items.map((item) => (
										<ResultCard
											key={item.id}
											item={item}
										/>
									))}
								</Group>
							</Scroller>
						)}
					</article>
				))}
			</section>
		</motion.div>
	);
}

export default SearchResults;
