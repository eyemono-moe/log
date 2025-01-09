import { CONTENTFUL_CMA_TOKEN, CONTENTFUL_SPACE_ID } from "astro:env/server";
import contentful from "contentful-management";
import type { CMSClient } from "..";

const CONTENT_TYPE_ID = "blogPost";

type ContentfulEntryFields = {
	slug: {
		ja: string;
	};
	postContent: {
		ja: string;
	};
};

export const createContentfulClient = (): CMSClient => {
	const client = contentful.createClient(
		{
			accessToken: CONTENTFUL_CMA_TOKEN,
		},
		{
			type: "plain",
			defaults: {
				spaceId: CONTENTFUL_SPACE_ID,
				environmentId: "master",
			},
		},
	);

	return {
		async createPost(slug) {
			const entry = await client.entry.create<ContentfulEntryFields>(
				{
					contentTypeId: CONTENT_TYPE_ID,
				},
				{
					fields: {
						slug: {
							ja: slug,
						},
						postContent: {
							ja: "",
						},
					},
				},
			);

			// publish the entry
			await client.entry.publish(
				{ entryId: entry.sys.id },
				{
					fields: entry.fields,
					sys: entry.sys,
				},
			);

			return {
				slug: entry.fields.slug.ja,
				content: entry.fields.postContent.ja,
				createdAt: entry.sys.createdAt,
				updatedAt: entry.sys.updatedAt,
			};
		},
		async getPost(slug) {
			const entry = await client.entry.getMany<ContentfulEntryFields>({
				query: {
					content_type: CONTENT_TYPE_ID,
					select: "fields.slug,fields.postContent,sys.createdAt,sys.updatedAt",
					"fields.slug": slug,
					limit: 1,
				},
			});
			if (entry.total === 0) {
				throw new Error("Post not found");
			}

			return {
				slug: entry.items[0].fields.slug.ja,
				content: entry.items[0].fields.postContent.ja,
				createdAt: entry.items[0].sys.createdAt,
				updatedAt: entry.items[0].sys.updatedAt,
			};
		},
		async getPosts(filter) {
			// see: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/ranges
			const f = filter?.after
				? {
						"sys.createdAt[gte]": filter.after.toISOString(),
					}
				: {};
			const entries = await client.entry.getMany<ContentfulEntryFields>({
				query: {
					content_type: CONTENT_TYPE_ID,
					select: "fields.slug,fields.postContent,sys.createdAt,sys.updatedAt",
					order: "-sys.createdAt", // newest first
					...f,
				},
			});
			return entries.items.map((entry) => {
				return {
					slug: entry.fields.slug.ja,
					content: entry.fields.postContent.ja,
					createdAt: entry.sys.createdAt,
					updatedAt: entry.sys.updatedAt,
				};
			});
		},
		async updatePost(slug, content) {
			const entry = await client.entry.getMany({
				query: {
					content_type: CONTENT_TYPE_ID,
					select: "sys.id",
					"fields.slug": slug,
					limit: 1,
				},
			});
			if (entry.total === 0) {
				throw new Error("Post not found");
			}

			await client.entry.update<ContentfulEntryFields>(
				{ entryId: entry.items[0].sys.id },
				{
					fields: {
						slug: {
							ja: slug,
						},
						postContent: {
							ja: content,
						},
					},
					sys: entry.items[0].sys,
				},
			);

			return {
				slug,
				content,
				createdAt: entry.items[0].sys.createdAt,
				updatedAt: entry.items[0].sys.updatedAt,
			};
		},
		async uploadFile(file) {
			// const asset = await client.asset.({
			// 	fields: {
			// 		title: {
			// 			ja: file.name,
			// 		},
			// 		file: {
			// 			ja: {
			// 				contentType: file.type,
			// 				fileName: file.name,
			// 				file: file,
			// 			},
			// 		},
			// 	},
			// });
			// await asset.processForLocale("ja");
			// return asset.fields.file.j
		},
	};
};
