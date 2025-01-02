import { getCollection } from "astro:content";

/**
 * Get all posts from the `posts` collection
 */
export const getPosts = () => {
	return getCollection("posts", ({ data }) => {
		// Only return published posts in production
		return import.meta.env.PROD ? data.draft !== true : true;
	});
};
