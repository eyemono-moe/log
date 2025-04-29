/**
 * Get the URL for an Open Graph image for a post
 *
 * @param post The post to get the image URL for
 * @param origin The origin of the site
 * @returns The URL for the Open Graph image
 */
export const postImageUrl = (postId: string, origin: string) => {
	return new URL(`/og/${postId}.png`, origin).toString();
};
