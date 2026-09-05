import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = {
	title: 'MuseFinder',
	description: 'A Place To Talk About Music',
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<Header />
				<main>{children}</main>
			</body>
		</html>
	);
}
