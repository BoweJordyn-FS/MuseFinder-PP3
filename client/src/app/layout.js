import { Geist, Geist_Mono } from 'next/font/google';
import { MantineProvider, mantineHtmlProps } from '@mantine/core';
import Header from '@/components/Header';
import '@mantine/core/styles.layer.css';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

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
			{...mantineHtmlProps}
		>
			<body className="min-h-full flex flex-col">
				<MantineProvider>
					<AuthProvider>
						<Header />
						{/* Pages render their own <main>; this is just the growth area
						    that makes the body's flex column fill the viewport. */}
						<div className="flex-1">{children}</div>
					</AuthProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
