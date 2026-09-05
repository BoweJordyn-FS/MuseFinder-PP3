import { CiSearch } from 'react-icons/ci';
import { BsSoundwave } from 'react-icons/bs';
import { Group, Scroller } from '@mantine/core';

export default function Home() {
	return (
		<div>
			<main>
				<div className="flex flex-col justify-center p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10">
					<form className="mx-2 sm:mx-10 lg:mx-20">
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
							/>
						</div>
					</form>

					{/* <section className="p-4 sm:p-6 lg:p-10 m-2 sm:m-6 lg:m-10 grid grid-cols-3 gap-10">
						<div className="flex justify-center border rounded-md border-white-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-white-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-white-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-white-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-white-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
						<div className="flex justify-center border rounded-md border-white-300 w-80 h-80 m-4">
							<h2 className="text-xl font-bold self-center">New Release</h2>
						</div>
					</section> */}

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
												className="flex justify-center border rounded-md border-white-300 w-80 h-80"
											>
												<p className="text-xl font-bold self-center">
													Artist Name
												</p>
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
												className="flex justify-center border rounded-md border-white-300 w-80 h-80"
											>
												<p className="text-xl font-bold self-center">
													Album Name
												</p>
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
												className="flex justify-center border rounded-md border-white-300 w-80 h-80"
											>
												<p className="text-xl font-bold self-center">
													Song Name
												</p>
											</div>
										))}
									</Group>
								</Scroller>
							</div>
						</article>
					</section>
				</div>
			</main>
		</div>
	);
}
