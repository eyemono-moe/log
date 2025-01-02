import type { DataEntryMap } from "astro:content";

/**
 * Get the URL for an Open Graph image for a post
 *
 * @param post The post to get the image URL for
 * @param origin The origin of the site
 * @returns The URL for the Open Graph image
 */
export const postImageUrl = (
	post: DataEntryMap["posts"][string],
	origin: string,
) => {
	return post.data.imageUrl ?? new URL(`/og/${post.id}.png`, origin).toString();
};
