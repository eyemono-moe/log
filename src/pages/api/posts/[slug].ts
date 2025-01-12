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

export const PUT: APIRoute = async ({ locals, params, request }) => {
	if (!locals.auth().userId) {
		return new Response("Unauthorized", { status: 401 });
	}
	const slug = params.slug;
	if (!slug) {
		return new Response("Bad Request", { status: 400 });
	}

	const body = await request.json();
	const content = body.content;
	if (!content) {
		return new Response("Bad Request", { status: 400 });
	}

	try {
		const updated = await cmsClient().updatePost(slug, content);
		return new Response(JSON.stringify(updated));
	} catch (e) {
		const message = e instanceof Error ? e.message : "Internal Server Error";
		return new Response("Internal Server Error", {
			status: 500,
			statusText: message,
		});
	}
};
