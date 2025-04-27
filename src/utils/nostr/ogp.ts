import { useQuery } from "@tanstack/solid-query";
import * as v from "valibot";

const oembedResScheme = v.object({
	html: v.string(),
	width: v.optional(v.number()),
	height: v.optional(v.number()),
});

const oEmbedProviders: {
	name: string;
	patterns: string[];
	endpoint: string;
}[] = [
	{
		name: "youtube",
		patterns: [
			"https?://.*\\.youtube\\.com/watch.*",
			"https?://.*\\.youtube\\.com/v/.*",
			"https?://youtu\\.be/.*",
			"https?://.*\\.youtube\\.com/playlist\\?list=.*",
		],
		endpoint: "https://www.youtube.com/oembed",
	},
	{
		name: "spotify",
		patterns: ["https?://open\\.spotify\\.com/.*", "spotify:.*"],
		endpoint: "https://open.spotify.com/oembed",
	},
];

const getOEmbedProvider = (url: string) => {
	for (const provider of oEmbedProviders) {
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
		proxy ? `https://corsproxy.io/?url=${encodeURIComponent(url)}` : url,
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
		!/charset=utf-8/i.test(contentType) &&
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
			parseRes.output.url = new URL(parseRes.output.url, url).href;
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

			// const ogpWithoutProxy = await fetchOgp(url() ?? "", false);
			// if (ogpWithoutProxy)
			//   return {
			//     type: "ogp" as const,
			//     value: ogpWithoutProxy,
			//   };
			return null;
		},
		enabled: !!url(),
	}));
};
