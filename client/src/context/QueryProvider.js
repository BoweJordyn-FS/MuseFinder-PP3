'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// query client has to be made in a client component, not the layout
export function QueryProvider({ children }) {
	// useState so it's only created once
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
