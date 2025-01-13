import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import EntryEditor from "./EntryEditor";

const SolidEditor: Component = () => {
	const client = new QueryClient({
		defaultOptions: {
			queries: {
				// CMS側で変更しうるので短めに設定
				staleTime: 1000 * 60 * 30, // 30min
				gcTime: Number.POSITIVE_INFINITY,
			},
		},
	});

	console.log("SolidEditor", client);

	return (
		<QueryClientProvider client={client}>
			<EntryEditor />
		</QueryClientProvider>
	);
};

export default SolidEditor;
