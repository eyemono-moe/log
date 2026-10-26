import type { PostEntry } from "../content.config";

/**
 * Get the URL for an Open Graph image for a post
 *
 * @param postId The id of the post
 * @param origin The origin of the site
 * @returns The URL for the Open Graph image
 */
export const postOgImageUrl = (postId: string, origin: string) => {
	return new URL(`/og/${postId}.png`, origin).toString();
};

/**
 * Get the URL for a thumbnail image shown in post lists
 *
 * @param post The post to get the thumbnail URL for
 * @param origin The origin of the site
 * @returns The URL for the thumbnail image
 */
export const postThumbnailUrl = (
	post: Pick<PostEntry, "id" | "imageUrl" | "source">,
	origin: string,
) => {
	// 外部記事は配信元の画像をそのまま使う
	if (post.source !== "eyemono.log") {
		return post.imageUrl;
	}
	return new URL(`/thumb/${post.id}.webp`, origin).toString();
};
