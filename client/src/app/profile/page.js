import React from 'react';

function Profile() {
	return (
		<main className="flex justify-center">
			<section id="profileInfo">
				<div
					id="banner"
					className="bg-purple-500 h-50 w-screen"
				></div>
				<div className="w-50 h-50 border border-gray-300 rounded-full bg-white relative -top-15 left-5"></div>
			</section>
		</main>
	);
}

export default Profile;
