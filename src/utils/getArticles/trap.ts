import * as v from "valibot";
import type { PostEntry } from "../../content.config";
import { sign } from "../jwt";

const traqPostTagSchema = v.object({
	id: v.string(),
	name: v.string(),
	slug: v.string(),
	visibility: v.union([v.literal("public"), v.literal("internal")]),
	url: v.pipe(v.string(), v.url()),
});

const getPostsResponseSchema = v.object({
	posts: v.array(
		v.object({
			id: v.string(),
			title: v.string(),
			url: v.string(),
			feature_image: v.nullable(v.string()),
			published_at: v.string(),
			tags: v.optional(v.array(traqPostTagSchema)),
		}),
	),
});

// traPブログのタグをzenn/log.eyemono.moeのタグに変換するためのマップ
const normalizeTagMap = new Map(
	Object.entries({
		SolidJS: "solidjs",
		Solid: "solidjs",
		Nostr: "nostr",
		TypeScript: "typescript",
		javascript: "javascript",
		CSS: "css",
		UnoCSS: "unocss",
	}),
);

const ideaPosts = [
	"662cc1b872cf190001078817", // 科学大デジタル創作同好会traPでの6年間実際どうだったのって話
	"6449e400f835150001ba85a6", // traPの読み方 2024
	"642ce39ff835150001ba4302", // 情報理工学院/工学院 以外の学生へ
	"6225a20e2162db0001d595e5", // 部内ショートプレゼン会「らん☆ぷろ」の紹介【新歓ブログリレー12日目】
	"6225a1be2162db0001d595e0", // traPに入部してくれてありがとう
	"60d9378185478300011b43b0", // 誕生ッ！3DCG部
	"605ce152fb6c5f000121a89b", // traPの読み方
];

const getPosts = async (apiKey: string) => {
	const token = await sign(apiKey);
	const headers = { Authorization: `Ghost ${token}` };

	const searchParams = new URLSearchParams({
		includes: "authors",
		// fields: "title,url,published_at,feature_image",
		filter: "authors.name:d_etteiu8383+status:published+visibility:public",
		limit: "all",
		order: "published_at desc",
	});
	const apiUrl = new URL("https://blog-admin.trap.jp/ghost/api/admin/posts");
	apiUrl.search = searchParams.toString();

	const res = await fetch(apiUrl, { headers });
	if (!res.ok) {
		throw new Error(`Failed to fetch: ${res.statusText}`);
	}
	const json = await res.json();
	const data = v.parse(getPostsResponseSchema, json);
	return data.posts;
};

export const fetchTrapArticles = async (apiKey: string) => {
	const posts = await getPosts(apiKey);

	const articles: PostEntry[] = posts.map((post) => ({
		id: post.id,
		source: "trap.jp",
		url: post.url,
		title: post.title,
		imageUrl: post.feature_image ?? undefined,
		createdAt: new Date(post.published_at),
		category: ideaPosts.includes(post.id) ? "idea" : "tech",
		tags:
			post.tags
				?.filter((t) => t.visibility === "public")
				.map((t) => normalizeTagMap.get(t.name) ?? t.name) ?? [],
	}));

	return articles;
};
