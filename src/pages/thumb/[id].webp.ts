import type { APIRoute } from "astro";
import type { AstroPostEntry } from "../../content.config";
import { getPosts } from "../../utils/getPost";
import { renderPostImage } from "../../utils/renderPostImage";

export async function getStaticPaths() {
	const blogEntries = await getPosts();
	return blogEntries.map((entry) => ({
		params: { id: entry.id },
		props: { entry },
	}));
}

// 一覧表示(幅500px程度)の2x相当
const width = 800;

/**
 * 記事一覧用の軽量なサムネ画像
 */
export const GET: APIRoute<{ entry: AstroPostEntry }> = async ({ props }) => {
	const image = await renderPostImage(props.entry, width);
	const webp = await image.webp({ quality: 80 }).toBuffer();

	return new Response(new Uint8Array(webp), {
		headers: {
			"Content-Type": "image/webp",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
