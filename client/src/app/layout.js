import { Geist, Geist_Mono } from 'next/font/google';
import { MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Header from '@/components/Header';
import './globals.css';
import '@mantine/core/styles.layer.css';
import { AuthProvider } from '@/context/AuthContext';
import { QueryProvider } from '@/context/QueryProvider';
import { theme, modalProps } from '@/lib/theme';
import SpotifyConnect from '@/components/SpotifyConnect';

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
				<QueryProvider>
					<MantineProvider
						theme={theme}
						forceColorScheme="dark"
					>
						<ModalsProvider modalProps={modalProps}>
							<AuthProvider>
								<Header />

								<div className="flex flex-1 flex-col">
									<SpotifyConnect>{children}</SpotifyConnect>
								</div>
							</AuthProvider>
						</ModalsProvider>
					</MantineProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
