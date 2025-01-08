import { z } from "astro:content";
import type { Loader } from "astro/loaders";
import type { CMSClient } from "..";
import { cleanupEntries } from "./cleanupEntries";
import { loadEntries } from "./loadEntries";

export type Options = {
	cms: CMSClient;
};

export const CMSLoader = (options: Options): Loader => {
	return {
		name: "cms-loader",
		load: async (ctx): Promise<void> => {
			const lastModified = ctx.meta.get("lastModified");

			if (ctx.store.keys().length > 0) {
				// Cleanup entries that are no longer in the collection
				await cleanupEntries(options, ctx);
			}

			// Load the (modified) entries
			await loadEntries(
				options,
				ctx,
				lastModified ? new Date(lastModified) : undefined,
			);

			// Set the last modified date to the current date
			ctx.meta.set("lastModified", new Date().toISOString());
		},
		schema: z.object({
			title: z.string().nonempty(),
			summary: z.string().optional(),
			tags: z.array(z.string()).optional(),
			draft: z.boolean().optional(),
			imageUrl: z.string().url().optional(),
		}),
	};
};
