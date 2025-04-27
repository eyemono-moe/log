import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import { RxNostrProvider } from "../../provider/nostr";
import Notes from "./Notes";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 min
			gcTime: 1000 * 60 * 60, // 1 hour
			retry: false,
		},
	},
});

const Monologue: Component = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<RxNostrProvider>
				<Notes />
			</RxNostrProvider>
		</QueryClientProvider>
	);
};

export default Monologue;
