import { defineCollection } from "astro:content";
import { cmsClient } from "./libs/cms/client";
import { CMSLoader } from "./libs/cms/loader";

const postCollection = defineCollection({
	loader: CMSLoader({
		cms: cmsClient(),
	}),
});

export const collections = {
	posts: postCollection,
};
