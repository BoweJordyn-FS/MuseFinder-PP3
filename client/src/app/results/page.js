'use client';
import React from 'react';
import * as motion from 'motion/react-client';
import { Group, Scroller } from '@mantine/core';
import { BsSoundwave } from 'react-icons/bs';

function Results() {
	return (
		<motion.div
			className="w-full"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', bounce: 0.2 }}
		>
			{/* search results */}
			<section className="p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10 flex flex-col gap-20">
				<article>
					<div className="border-b-2 border-[#925FF0] mb-10">
						<h2 className="text-3xl font-bold text-[#925FF0]">Artists</h2>
					</div>
					<div
						id="artistRow"
						className="flex flex-row gap-4"
					>
						<Scroller
							draggable
							edgeGradientColor="transparent"
							startControlIcon={<BsSoundwave size={20} />}
							endControlIcon={<BsSoundwave size={20} />}
						>
							<Group
								id="artistResults"
								justify="center"
								gap="md"
								wrap="nowrap"
							>
								{Array.from({ length: 6 }).map((_, index) => (
									<div
										key={index}
										className="flex justify-center border rounded-md border-gray-300 w-80 h-80"
									>
										<p className="text-xl font-bold self-center">Artist Name</p>
									</div>
								))}
							</Group>
						</Scroller>
					</div>
				</article>
				<article>
					<div className="border-b-2 border-[#925FF0] mb-10">
						<h2 className="text-3xl font-bold text-[#925FF0]">Albums</h2>
					</div>
					<div
						id="albumRow"
						className="flex flex-row gap-4"
					>
						<Scroller
							draggable
							edgeGradientColor="transparent"
							startControlIcon={<BsSoundwave size={20} />}
							endControlIcon={<BsSoundwave size={20} />}
						>
							<Group
								id="albumResults"
								justify="center"
								gap="md"
								wrap="nowrap"
							>
								{Array.from({ length: 6 }).map((_, index) => (
									<div
										key={index}
										className="flex justify-center border rounded-md border-gray-300 w-80 h-80"
									>
										<p className="text-xl font-bold self-center">Album Name</p>
									</div>
								))}
							</Group>
						</Scroller>
					</div>
				</article>
				<article>
					<div className="border-b-2 border-[#925FF0] mb-10">
						<h2 className="text-3xl font-bold text-[#925FF0]">Tracks</h2>
					</div>
					<div
						id="songRow"
						className="flex flex-row gap-4"
					>
						<Scroller
							draggable
							edgeGradientColor="transparent"
							startControlIcon={<BsSoundwave size={20} />}
							endControlIcon={<BsSoundwave size={20} />}
						>
							<Group
								id="songResults"
								justify="center"
								gap="md"
								wrap="nowrap"
							>
								{Array.from({ length: 6 }).map((_, index) => (
									<div
										key={index}
										className="flex justify-center border rounded-md border-gray-300 w-80 h-80"
									>
										<p className="text-xl font-bold self-center">Song Name</p>
									</div>
								))}
							</Group>
						</Scroller>
					</div>
				</article>
			</section>
		</motion.div>
	);
}

export default Results;
