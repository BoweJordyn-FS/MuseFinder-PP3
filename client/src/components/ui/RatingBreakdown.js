'use client';
import React from 'react';
import { Progress } from '@mantine/core';

const levels = [5, 4, 3, 2, 1];
const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

// how many reviews got each rating. bars are relative to the most common
// one so the shape still reads with only a few reviews
function RatingBreakdown({ posts = [] }) {
	const counts = levels.map(
		(level) => posts.filter((post) => post.rating === level).length,
	);
	const max = Math.max(...counts, 1);

	return (
		<section className="mt-2 flex flex-col gap-1">
			{levels.map((level, index) => (
				<div
					key={level}
					className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
				>
					<span className="whitespace-nowrap text-xs tracking-tighter text-[#925FF0]">
						{stars(level)}
					</span>
					<Progress
						value={(counts[index] / max) * 100}
						color="#925FF0"
						size="sm"
						radius="xl"
					/>
					<span className="w-4 text-right text-xs text-gray-500">
						{counts[index]}
					</span>
				</div>
			))}
		</section>
	);
}

export default RatingBreakdown;
