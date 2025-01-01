import type { DataEntryMap } from "astro:content";

export const ogImageUrl = (
	post: DataEntryMap["posts"][string],
	origin: string,
) => {
	return (
		post.data.imageUrl ?? new URL(`/og/${post.slug}.png`, origin).toString()
	);
};
