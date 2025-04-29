import { getCollection, render } from "astro:content";
import { parseISO } from "date-fns";
import type { PostEntry } from "../content.config";
import { getArticles } from "./getArticles";

/**
 * Get all posts from the `posts` collection
 */
export const getPosts = () => {
	return getCollection("posts", ({ data }) => {
		// Only return published posts in production
		return import.meta.env.PROD ? data.draft !== true : true;
	});
};

/**
 * Get all posts including third-party posts
 * @param {string} origin - The origin URL of the site
 * @returns {Promise<PostEntry[]>} All posts
 */
export const getAllPosts = async (origin?: string) => {
	const postEntries = await getPosts();

	const postsWithLstMod = await Promise.all(
		postEntries.map(async (post) => {
			// 一度もpushしていない編集中記事はundefinedになる
			const updatedAtStr = (await render(post)).remarkPluginFrontmatter
				.lastModified;
			let updatedAt: Date | undefined;
			if (updatedAtStr) {
				updatedAt = parseISO(updatedAtStr);
			}

			return {
				id: post.id,
				source: "eyemono.log" as const,
				url: `/posts/${post.id}`,
				category: post.data.category,
				summary: post.data.summary,
				title: post.data.title,
				updatedAt,
				createdAt: post.data.createdAt,
				tags: post.data.tags,
			} satisfies PostEntry;
		}),
	);

	const thirdPartyPosts = await getArticles();
	const allPosts: PostEntry[] = [...postsWithLstMod, ...thirdPartyPosts];
	const sortedPosts = allPosts.sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	);

	return sortedPosts;
};
