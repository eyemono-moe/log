import type { LoaderContext } from "astro/loaders";
import type { Options } from ".";

/**
 * Cleanup entries that are no longer in the remote collection.
 *
 * @param options Options for the loader.
 * @param context Context of the loader.
 */
export const cleanupEntries = async (
	options: Options,
	context: LoaderContext,
): Promise<void> => {
	const response = await options.cms.getPosts({});

	// Add the ids to the set
	const posts = new Set(response.map((entry) => entry.slug));

	let cleanedUp = 0;

	// Get all ids of the entries in the store
	const storedIds = context.store
		.values()
		.map((entry) => entry.data.slug) as Array<string>;
	for (const id of storedIds) {
		// If the id is not in the entries set, remove the entry from the store
		if (!posts.has(id)) {
			context.store.delete(id);
			cleanedUp++;
		}
	}

	if (cleanedUp > 0) {
		// Log the number of cleaned up entries
		context.logger.info(`(cms-loader) Cleaned up ${cleanedUp} old entries.`);
	}
};
