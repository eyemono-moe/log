import * as v from "valibot";
import type { PostEntry } from "../../content.config";

const zennArticlesSchema = v.object({
	articles: v.array(
		v.object({
			title: v.string(),
			slug: v.string(),
			path: v.string(),
			published_at: v.string(),
		}),
	),
});

const zennArticleSchema = v.object({
	article: v.object({
		og_image_url: v.string(),
		topics: v.array(
			v.object({
				name: v.string(),
			}),
		),
	}),
});

const zennApiEndpoint =
	"https://zenn.dev/api/articles?username=eyemono_moe&count=100";

export const fetchZennArticles = async (): Promise<PostEntry[]> => {
	try {
		const response = await fetch(zennApiEndpoint);
		const jsonResponse = await response.json();

		const { articles: zennArticles } = v.parse(
			zennArticlesSchema,
			jsonResponse,
		);

		const articleDetails = await Promise.all(
			zennArticles.map(async (article) => {
				const res = await fetch(
					`https://zenn.dev/api/articles/${article.slug}`,
				);
				const json = await res.json();
				const articleResponse = v.parse(zennArticleSchema, json);
				const ogImageUrl = articleResponse.article.og_image_url;
				const topics = articleResponse.article.topics;
				return { ogImageUrl, topics };
			}),
		);

		const articles: PostEntry[] = zennArticles.map((a, i) => ({
			source: "zenn.dev",
			title: a.title,
			url: `https://zenn.dev${a.path}`,
			createdAt: new Date(a.published_at),
			imageUrl: articleDetails[i].ogImageUrl,
			tags: articleDetails[i].topics.map((t) => t.name),
			category: "tech",
		}));

		return articles;
	} catch (err) {
		console.error(err);
		return [];
	}
};
