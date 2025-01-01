import { defineCollection, z } from "astro:content";

const postCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string().nonempty(),
		summary: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional(),
		imageUrl: z.string().url().optional(),
	}),
});

export const collections = {
	posts: postCollection,
};
