import type { PostEntry } from "../content.config";

/**
 * Get the URL for an Open Graph image for a post
 *
 * @param post The post to get the image URL for
 * @param origin The origin of the site
 * @returns The URL for the Open Graph image
 */
export const postImageUrl = (
	post: Pick<PostEntry, "id" | "imageUrl">,
	origin: string,
) => {
	const originalPostUrl = post.imageUrl;

	if (originalPostUrl) {
		// 絶対パスならそのまま返す
		if (originalPostUrl.startsWith("http")) {
			return originalPostUrl;
		}
		if (originalPostUrl.startsWith("/public/")) {
			// publicフォルダ内のパスならoriginを付与
			// [TODO] OGP画像も最適化する
			return new URL(
				originalPostUrl.replace(/^\/public/, ""),
				origin,
			).toString();
		}
	}

	// 未設定ならOGP画像を生成するURLを返す
	const postId = post.id;
	return new URL(`/og/${postId}.png`, origin).toString();
};
