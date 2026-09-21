'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// The QueryClient is a class instance, so it can't be created in the server
// component layout and passed down. This client component owns it instead.
export function QueryProvider({ children }) {
	// useState so one client is created per app, not one per render.
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 5, // cache data for 5 minutes before refetching
						retry: 1, // retry failed requests once
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
