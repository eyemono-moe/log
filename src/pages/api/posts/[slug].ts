export const prerender = false;

import type { APIRoute } from "astro";
import { cmsClient } from "../../../libs/cms/client";

export const GET: APIRoute = async ({ locals, params }) => {
	if (!locals.auth().userId) {
		return new Response("Unauthorized", { status: 401 });
	}
	const slug = params.slug;
	if (!slug) {
		return new Response("Bad Request", { status: 400 });
	}

	const posts = await cmsClient().getPost(slug);

	return new Response(JSON.stringify(posts));
};
