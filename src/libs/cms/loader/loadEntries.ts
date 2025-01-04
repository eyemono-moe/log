import type { LoaderContext } from "astro/loaders";
import type { CMSClient } from "..";

export const loadEntries = async (client: CMSClient, ctx: LoaderContext) => {
	const posts = await client.getPosts();
};
