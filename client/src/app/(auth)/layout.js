import Image from 'next/image';
import authImage from './images/ruido-98-4ypOQVIfrVY-unsplash.jpg';

export default function AuthLayout({ children }) {
	return (
		<div className="grid flex-1 grid-cols-1 md:grid-cols-2">
			{/* art is decorative, drop it on small screens */}
			<div className="relative hidden md:block">
				<Image
					src={authImage}
					alt=""
					fill
					className="object-cover"
					priority
				/>
			</div>
			<div className="flex flex-col bg-white">{children}</div>
		</div>
	);
}
