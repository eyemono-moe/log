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

/**
 * OGP用の画像
 */
export const GET: APIRoute<{ entry: AstroPostEntry }> = async ({ props }) => {
	const image = await renderPostImage(props.entry);
	const png = await image.png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
