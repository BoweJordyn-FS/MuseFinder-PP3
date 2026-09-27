'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowCircleLeft } from 'iconsax-react';
import PostCard from '@/components/ui/PostCard';
import { getPost } from '@/services/posts';
import { errorMessage } from '@/lib/api';

// a single review, what the arrow in a playlist links to
function PostPage() {
	const { id } = useParams();

	const {
		data: post,
		isPending,
		error,
	} = useQuery({
		queryKey: ['posts', id],
		queryFn: () => getPost(id),
	});

	return (
		<main className="flex flex-col gap-6 p-10 max-w-3xl">
			<Link
				href="/profile"
				className="text-[#925FF0] hover:underline flex flex-row items-center gap-2 w-fit"
			>
				<ArrowCircleLeft
					variant="Broken"
					size={18}
					color="#925FF0"
				/>{' '}
				Back to profile
			</Link>

			{isPending && <p className="text-gray-500">Loading…</p>}
			{error && <p className="text-red-500">{errorMessage(error)}</p>}
			{post && <PostCard post={post} />}
		</main>
	);
}

export default PostPage;
