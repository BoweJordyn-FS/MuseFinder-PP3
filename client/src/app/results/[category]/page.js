'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { search, CATEGORIES } from '@/services/spotify';
import ResultCard from '@/components/ui/ResultCard';

function CategoryInner() {
	const { category } = useParams();
	const q = useSearchParams().get('q');
	const type = CATEGORIES[category];
	if (!type) notFound();

	const [items, setItems] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const load = async (offset) => {
		setLoading(true);
		setError(null);
		try {
			const data = await search(q, { type, offset });
			const page = data[category];
			setItems((prev) =>
				offset === 0 ? page.items : [...prev, ...page.items],
			);
			setTotal(page.total);
		} catch (err) {
			setError(err.response?.data?.error || err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (q) load(0);
	}, [q, type]);

	if (!q)
		return <p className="p-10 text-gray-500">Search for something first.</p>;

	const title = category[0].toUpperCase() + category.slice(1);

	return (
		<section className="p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10">
			<div className="border-b-2 border-[#925FF0] mb-10 flex items-baseline justify-between">
				<h2 className="text-3xl font-bold text-[#925FF0]">
					{title} for “{q}”
				</h2>
				<Link
					href={`/results?q=${encodeURIComponent(q)}`}
					className="text-[#925FF0] hover:underline"
				>
					← All results
				</Link>
			</div>

			{error && <p className="text-red-600 mb-6">{error}</p>}

			<div className="flex flex-wrap gap-6">
				{items.map((item) => (
					<ResultCard
						key={item.id}
						item={item}
					/>
				))}
			</div>

			{!loading && items.length === 0 && !error && (
				<p className="text-gray-500">No {category} found.</p>
			)}

			{items.length < total && (
				<button
					onClick={() => load(items.length)}
					disabled={loading}
					className="mt-10 bg-black rounded-full px-8 py-2 text-white hover:bg-[#925FF0] disabled:opacity-50"
				>
					{loading ? 'Loading…' : 'Load more'}
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
