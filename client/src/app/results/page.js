'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/SearchResults';

function ResultsInner() {
	const q = useSearchParams().get('q');
	if (!q)
		return <p className="p-10 text-gray-500">Search for something first.</p>;
	return <SearchResults q={q} />;
}

export default function Results() {
	return (
		<Suspense>
			<ResultsInner />
		</Suspense>
	);
}
