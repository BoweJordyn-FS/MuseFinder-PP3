import Image from 'next/image';
import authImage from './images/ruido-98-4ypOQVIfrVY-unsplash.jpg';

export default function AuthLayout({ children }) {
	return (
		<div className="grid flex-1 grid-cols-1 md:grid-cols-2">
			<div className="relative hidden md:block">
				<Image
					src={authImage}
					alt="Auth Page Art"
					fill
					sizes="(min-width: 768px) 50vw, 0px"
					loading="eager"
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col bg-white">{children}</div>
		</div>
	);
}
