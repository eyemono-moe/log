import type { LoaderContext } from "astro/loaders";
import pLimit from "p-limit";
import type { Options } from ".";
import { createEntryRender } from "./entryRender";
import { parseEntry } from "./parseEntry";

/**
 * Load (modified) entries from a PocketBase collection.
 *
 * @param options Options for the loader.
 * @param context Context of the loader.
 * @param lastModified Date of the last fetch to only update changed entries.
 *
 * @returns `true` if the collection has an updated column, `false` otherwise.
 */
export const loadEntries = async (
	options: Options,
	context: LoaderContext,
	lastModified: Date | undefined,
): Promise<void> => {
	const render = await createEntryRender(context.config.markdown);

	// Log the fetching of the entries
	context.logger.info(
		`(cms-loader) Fetching${lastModified ? " modified" : ""} data${lastModified ? ` starting at ${lastModified}` : ""}`,
	);

	// Fetch all (modified) entries
	const response = await options.cms.getPosts({ after: lastModified });

	const limit = pLimit(10);

	// Parse and store the entries
	await Promise.all(
		response.map((entry) =>
			limit(async () => {
				await parseEntry(entry, context, render);
			}),
		),
	);

	// Log the number of fetched entries
	context.logger.info(
		`(load-cms) Fetched ${response.length}${lastModified ? " changed" : ""} entries.`,
	);
};
