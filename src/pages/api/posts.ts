export const prerender = false;

import type { APIRoute } from "astro";
import { cmsClient } from "../../libs/cms/client";

export const GET: APIRoute = async ({ locals }) => {
	if (!locals.auth().userId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const posts = await cmsClient().getPosts();

	return new Response(JSON.stringify(posts));
};
