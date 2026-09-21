'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { search, CATEGORIES } from '@/services/spotify';
import ResultCard from '@/components/ui/ResultCard';
import { errorMessage } from '@/lib/api';
import { ArrowCircleLeft } from 'iconsax-react';

function CategoryInner() {
	const { category } = useParams();
	const q = useSearchParams().get('q');
	const type = CATEGORIES[category];
	if (!type) notFound();

	const {
		data,
		isPending,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['search', q, type],
		queryFn: ({ pageParam }) => search(q, { type, offset: pageParam }),
		initialPageParam: 0,

		getNextPageParam: (lastPage) => {
			const page = lastPage[category];
			if (!page.next || page.items.length === 0) return undefined;
			return page.offset + page.items.length;
		},
		enabled: Boolean(q),
	});

	if (!q)
		return <p className="p-10 text-gray-500">Search for something first.</p>;

	const items = data?.pages.flatMap((page) => page[category].items) ?? [];
	const title = category[0].toUpperCase() + category.slice(1);

	return (
		<section className="p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10">
			<div className="border-b-2 border-[#925FF0] mb-10 flex items-baseline justify-between">
				<h2 className="text-3xl font-bold text-[#925FF0]">
					{title} for “{q}”
				</h2>
				<Link
					href={`/results?q=${encodeURIComponent(q)}`}
					className="text-[#925FF0] hover:underline flex flex-row items-center gap-2"
				>
					<ArrowCircleLeft
						variant="broken"
						size={18}
						color="#925FF0"
					/>{' '}
					All results
				</Link>
			</div>

			{error && (
				<p className="text-red-600 mb-6">{errorMessage(error)}</p>
			)}

			{isPending && <p className="text-gray-500">Searching…</p>}

			<div className="flex flex-wrap gap-6 justify-center">
				{items.map((item) => (
					<ResultCard
						key={item.id}
						item={item}
					/>
				))}
			</div>

			{!isPending && items.length === 0 && !error && (
				<p className="text-gray-500">No {category} found.</p>
			)}

			{hasNextPage && (
				<button
					onClick={() => fetchNextPage()}
					disabled={isFetchingNextPage}
					className="mt-10 bg-black rounded-full px-8 py-2 text-white hover:bg-[#925FF0] disabled:opacity-50"
				>
					{isFetchingNextPage ? 'Loading…' : 'Load more'}
				</button>
			)}
		</section>
	);
}

export default function CategoryPage() {
	return (
		<Suspense>
			<CategoryInner />
		</Suspense>
	);
}
