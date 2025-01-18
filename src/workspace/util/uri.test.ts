import { describe } from "node:test";
import { expect, test } from "vitest";
import {
	createMemoryFileUri,
	createOriginalFileUri,
	getSlugFromUri,
	toOriginalFileUri,
} from "./uri";

describe("createMemoryFileUri", () => {
	test("should create a vscode.Uri with the correct file scheme and path", () => {
		const post = {
			slug: "example-post",
			content: "",
			createdAt: "",
			updatedAt: "",
		};
		const uri = createMemoryFileUri(post);

		expect(uri.scheme).toBe("file");
		expect(uri.path).toBe("/posts/example-post.md");
	});
});

describe("createOriginalFileUri", () => {
	test("should create a vscode.Uri with the correct cms scheme and path", () => {
		const post = {
			slug: "example-post",
			content: "",
			createdAt: "",
			updatedAt: "",
		};
		const uri = createOriginalFileUri(post);

		expect(uri.scheme).toBe("file");
		expect(uri.path).toBe("/example-post.md");
	});
});

describe("toOriginalFileUri", () => {
	test("should convert a memory file Uri to an original file Uri", () => {
		const post = {
			slug: "example-post",
			content: "",
			createdAt: "",
			updatedAt: "",
		};
		const memoryUri = createMemoryFileUri(post);
		const originalUriFromMemory = toOriginalFileUri(memoryUri);
		const originalUri = createOriginalFileUri(post);

		expect(originalUriFromMemory.scheme).toBe(originalUri.scheme);
		expect(originalUriFromMemory.path).toBe(originalUri.path);
	});
});

describe("getSlugFromUri", () => {
	test("should extract the slug from a Uri path", () => {
		const post = {
			slug: "example-post",
			content: "",
			createdAt: "",
			updatedAt: "",
		};
		const uri = createMemoryFileUri(post);
		const slug = getSlugFromUri(uri);

		expect(slug).toBe("example-post");
	});
});
