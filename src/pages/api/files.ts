export const prerender = false;

import type { APIRoute } from "astro";
import { cmsClient } from "../../libs/cms/client";

export const POST: APIRoute = async ({ request, locals }) => {
	if (!locals.auth().userId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get("file");
	if (!file) {
		return new Response("file not found", { status: 400 });
	}
	if (typeof file === "string") {
		return new Response("file is not a file", { status: 400 });
	}

	const created = await cmsClient().uploadFile(file);

	return new Response(
		JSON.stringify({
			url: created,
		}),
	);
};
