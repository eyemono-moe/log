import { type CollectionEntry, defineCollection, z } from "astro:content";
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
		imageUrl: z.string().optional(),
		createdAt: z.date(),
		updatedAt: z.date().optional(),
		category: z.union([z.literal("tech"), z.literal("idea")]),
	}),
});

// Astroのcontent内のpostエントリー
export type AstroPostEntry = CollectionEntry<"posts">;

type PostSource = "trap.jp" | "zenn.dev" | "eyemono.log";

// 外部投稿を含めた全てのエントリーが持つべき型
export type PostEntry<T extends PostSource = PostSource> =
	AstroPostEntry["data"] & {
		id: string;
		source: T;
		url: string;
	};

export const collections = {
	posts: postCollection,
};
