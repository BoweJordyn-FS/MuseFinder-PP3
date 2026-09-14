import Image from 'next/image';
import authImage from './images/ruido-98-4ypOQVIfrVY-unsplash.jpg';

export default function AuthLayout({ children }) {
	return (
		<div className="grid grid-cols-2">
			<Image
				src={authImage}
				alt="AuthScreen Art"
				className="w-full h-screen object-cover"
				loading="eager"
			/>
			<div className="flex flex-col bg-white">\{children}</div>
		</div>
	);
}
