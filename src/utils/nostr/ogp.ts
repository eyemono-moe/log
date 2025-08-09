import { useQuery } from "@tanstack/solid-query";
import * as v from "valibot";
import {
	OEMBED_PROVIDERS,
	RICH_LINK,
} from "../../features/rich-link/constants";
import { resolveUrl } from "../../features/rich-link/utils";

const oembedResScheme = v.object({
	html: v.string(),
	width: v.optional(v.number()),
	height: v.optional(v.number()),
});

const getOEmbedProvider = (url: string) => {
	for (const provider of OEMBED_PROVIDERS) {
		for (const pattern of provider.patterns) {
			if (new RegExp(pattern).test(url)) {
				return provider;
			}
		}
	}
	return;
};

export const fetchOEmbed = async (url: string) => {
	const provider = getOEmbedProvider(url);
	if (!provider) {
		return;
	}
	const res = await fetch(
		`${provider.endpoint}?url=${encodeURIComponent(url)}`,
	);
	if (!res.ok) {
		return;
	}
	const data = await res.json();
	const parsed = v.safeParse(oembedResScheme, data);
	if (!parsed.success) {
		return;
	}
	return parsed.output;
};

const ogpScheme = v.object({
	title: v.string(),
	description: v.optional(v.string()),
	url: v.optional(v.string()),
	image: v.optional(v.string()),
	site_name: v.optional(v.string()),
});

const fetchOgp = async (url: string, proxy = true) => {
	const res = await fetch(
		proxy ? `${RICH_LINK.CORS_PROXY}?url=${encodeURIComponent(url)}` : url,
	);
	const contentType = res.headers.get("Content-Type");
	if (
		!res.ok ||
		res.status < 200 ||
		300 <= res.status ||
		!contentType ||
		!contentType.includes("text/html")
	) {
		return;
	}

	const html = await res.text();
	const doc = new DOMParser().parseFromString(html, "text/html");
	const metaTags = Array.from(doc.head.querySelectorAll("meta"));

	// check if charset is utf-8
	if (
		!RICH_LINK.CHARSET_UTF8.test(contentType) &&
		!metaTags.some((meta) =>
			meta.getAttribute("charset")?.toLowerCase().includes("utf-8"),
		)
	) {
		return;
	}

	const ogp = Object.fromEntries(
		metaTags
			.filter(
				(meta) =>
					meta.getAttribute("property")?.startsWith("og:") ||
					meta.getAttribute("name")?.startsWith("og:"),
			)
			.map(
				(meta) =>
					[
						meta.getAttribute("property")?.replace(/^og:/, "") ??
							meta.getAttribute("name")?.replace(/^og:/, "") ??
							"",
						meta.getAttribute("content") ?? "",
					] as const,
			),
	);

	const parseRes = v.safeParse(ogpScheme, ogp);
	if (parseRes.success) {
		if (parseRes.output.url?.startsWith("/")) {
			parseRes.output.url = resolveUrl(parseRes.output.url, url);
		}

		return parseRes.output;
	}
};

export const useQueryEmbed = (url: () => string | undefined) => {
	return useQuery(() => ({
		queryKey: ["embed", url()],
		queryFn: async () => {
			const oEmbed = await fetchOEmbed(url() ?? "");
			if (oEmbed)
				return {
					type: "oEmbed" as const,
					value: oEmbed,
				};

			const ogp = await fetchOgp(url() ?? "");
			if (ogp)
				return {
					type: "ogp" as const,
					value: ogp,
				};

			return null;
		},
		enabled: !!url(),
	}));
};
