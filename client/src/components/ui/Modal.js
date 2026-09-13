'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rating, Textarea, Group, Badge, Loader } from '@mantine/core';
import { Star1, TickCircle, PlayCircle, AddSquare } from 'iconsax-react';
import { useForm } from '@mantine/form';

function Modal() {
	const [rating, setRating] = useState(0);
	const [showSuccess, setShowSuccess] = useState(false);
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { review: '' },
	});
	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				//onClick
			>
				<motion.div
					// layoutId={`card-${album.id}`}
					onClick={(e) => e.stopPropagation()}
					className="bg-[#10100E] shadow-2xl shadow-amber-50/10 rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
				>
					{/* Posting / success overlay */}
					{/* <AnimatePresence>
							{(isPending || showSuccess) && (
								<motion.div
									key="overlay"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="absolute inset-0 bg-[#10100E]/95 flex flex-col items-center justify-center gap-3 z-10"
								>
									{showSuccess ? (
										<motion.div
											initial={{ scale: 0.4, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{
												type: 'spring',
												stiffness: 260,
												damping: 18,
											}}
										>
											<TickCircle
												size={72}
												variant="Bold"
												color="#925EF0"
											/>
										</motion.div>
									) : (
										<Loader
											color="violet"
											size="lg"
										/>
									)}
									<p className="text-white text-sm font-medium">
										{showSuccess ? 'Posted!' : 'Posting your review…'}
									</p>
								</motion.div>
							)}
						</AnimatePresence> */}
					<div
						id="modal-header"
						className="flex flex-row gap-4 mb-6"
					>
						{/* img */}
						<div
							id="container"
							className="group relative w-28 h-28 shrink-0 cursor-pointer"
						>
							<div className="w-full h-full rounded-lg object-cover bg-white transition duration-300 group-hover:brightness-50"></div>
							<div
								id="hover"
								className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 transition duration-300 group-hover:opacity-100 group-hover:scale-100"
							>
								<PlayCircle
									color="#925EF0"
									size={56}
									variant="Bold"
								/>
							</div>
						</div>
						<div className="flex flex-col justify-center gap-1 min-w-0">
							<h3 className="text-white text-lg font-medium leading-tight truncate">
								title
							</h3>
							<p className="text-gray-400 text-sm truncate">artist</p>

							<div className="flex flex-row items-center gap-1 mt-1">
								<Star1
									size={14}
									variant="Bold"
									color="#925EF0"
								/>
								<span className="text-sm text-white font-semibold">0.0</span>
							</div>
							<div className="flex flex-row flex-wrap gap-1 mt-1">
								<Badge
									size="xs"
									variant="default"
									className="p-1"
								>
									genre
								</Badge>
							</div>
						</div>
					</div>
					<form className="flex flex-col gap-4">
						<Rating
							emptySymbol={
								<Star1
									size={24}
									variant="Broken"
									color="#925EF0"
								/>
							}
							fullSymbol={
								<Star1
									size={24}
									variant="Bold"
									color="#925EF0"
								/>
							}
							count={5}
							value={rating}
							onChange={setRating}
						/>
						<Textarea
							placeholder="What are your thoughts..."
							autosize
							minRows={4}
							// key={form.key('review')}
							// {...form.getInputProps('review')}
							className="border border-[#925FF0] bg-[#1a1a1a] p-2 rounded-sm"
						/>
						<Group justify="space-between">
							<button className="text-[#925FF0] px-5 py-2 rounded-md flex flex-row gap-2 cursor-pointer">
								<AddSquare
									size={20}
									color="white"
								/>
								Add to Playlist
							</button>
							<button
								type="submit"
								className="bg-[#E9DFFC] text-[#925FF0] px-5 py-2 rounded-md font-light transition-colors hover:bg-[#925FF0] hover:text-[#E9DFFC] cursor-pointer"
							>
								Post
							</button>
						</Group>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

export default Modal;
