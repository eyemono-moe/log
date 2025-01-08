import type { RenderedContent } from "astro:content";
import type { LoaderContext } from "astro/loaders";
import type { Post } from "..";
import type { Render } from "./entryRender";
import { getEntryInfo } from "./getEntryInfo";

/**
 * Parse an entry and store it in the context.
 *
 * @param entry The entry to parse.
 * @param context The context of the loader.
 * @param render The render function to render the entry.
 */

export const parseEntry = async (
	entry: Post,
	context: LoaderContext,
	render: Render,
): Promise<void> => {
	const { body, data } = getEntryInfo(entry.content);
	const id = entry.slug;

	const digest = context.generateDigest(entry);

	const parsedData = await context.parseData({
		id,
		data,
	});

	let rendered: RenderedContent | undefined;
	try {
		rendered = await render({
			id,
			data,
			body,
		});
	} catch (error) {
		if (error instanceof Error) {
			context.logger.error(
				`(load-cms) Error rendering entry "${id}": ${error.message}`,
			);
		} else {
			context.logger.error(`(load-cms) Unknown error rendering entry "${id}"`);
		}
	}

	context.store.set({
		id,
		data: parsedData,
		body,
		rendered,
		digest,
	});
};
