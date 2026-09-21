'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { CiSearch } from 'react-icons/ci';
import SearchResults from '@/components/SearchResults';
import bg from './images/musefinderbg.png';
import { useQuery } from '@tanstack/react-query';
import { search } from '@/services/spotify';

export default function Home() {
	const [query, setQuery] = useState('');
	const [submitted, setSubmitted] = useState('');
	const show = Boolean(submitted);

	const {
		data: results,
		isPending,
		error,
	} = useQuery({
		queryKey: ['search', submitted],
		queryFn: () => search(submitted),
		enabled: show,
	});

	return (
		<main className="relative flex flex-1 flex-col overflow-hidden">
			<motion.div
				className="absolute inset-0 pointer-events-none"
				initial={false}
				animate={{ opacity: show ? 0 : 1, scale: show ? 1.08 : 1 }}
				transition={{ duration: 0.7, ease: 'easeOut' }}
			>
				<Image
					src={bg}
					alt=""
					fill
					priority
					className="object-fill"
				/>
			</motion.div>

			<div
				className={`relative flex flex-1 flex-col p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10 ${
					show ? 'justify-start' : 'justify-center'
				}`}
			>
				<motion.form
					layout
					transition={{ type: 'spring', bounce: 0.2 }}
					className="mx-2 sm:mx-10 lg:mx-20"
					onSubmit={(e) => {
						e.preventDefault();
						setSubmitted(query.trim());
					}}
				>
					<div className="relative">
						<CiSearch
							className="absolute left-4 top-1/2 -translate-y-1/2 text-[#925FF0] pointer-events-none"
							size={24}
						/>
						<input
							id="search"
							type="search"
							className="neu-input w-full py-3 pl-12 pr-5"
							placeholder="Search for artists, albums, or songs..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>
				</motion.form>

				{show && <SearchResults q={submitted} />}
			</div>
		</main>
	);
}
