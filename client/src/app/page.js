'use client';
import { useState, startTransition } from 'react';
import { CiSearch } from 'react-icons/ci';

import Modal from '@/components/ui/Modal';
import Results from './results/page';

export default function Home() {
	const [show, setShow] = useState(false);

	return (
		<div>
			<main>
				{/* <Modal /> */}
				<div className="flex flex-col justify-center p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10">
					<form
						className="mx-2 sm:mx-10 lg:mx-20"
						onSubmit={(e) => e.preventDefault()}
					>
						<div className="relative">
							<CiSearch
								className="absolute left-3 top-1/2 -translate-y-1/2 text-[#925FF0]"
								size={24}
							/>
							<input
								id="search"
								type="search"
								className="border w-full p-2 pl-10 rounded-md focus:outline-3 focus:outline-offset-2 focus:outline-[#925FF0]"
								placeholder="Search for artists, albums, or songs..."
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										startTransition(() => setShow(true));
									}
								}}
							/>
						</div>
					</form>

					{show && <Results />}

					{/* <section className="p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10 grid grid-cols-3 gap-10">
						<div className="flex justify-center border rounded-md border-gray-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-gray-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-gray-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-gray-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-gray-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-gray-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
					</section> */}
				</div>
			</main>
		</div>
	);
}
