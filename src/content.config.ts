import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postCollection = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/posts",
	}),
	schema: z.object({
		title: z.string().nonempty(),
		summary: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional(),
		imageUrl: z.string().url().optional(),
		createdAt: z.date(),
	}),
});

export const collections = {
	posts: postCollection,
};
