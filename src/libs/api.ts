import type { Post } from "./cms";

// TODO: validate

export const clientGetPosts = async () => {
	const response = await fetch("/api/posts");
	const data = await response.json();
	return data as Post[];
};

export const clientGetPost = async (slug: string) => {
	const response = await fetch(`/api/posts/${slug}`);
	const data = await response.json();
	return data as Post;
};

export const clientUpdatePost = async (slug: string, content: string) => {
	const response = await fetch(`/api/posts/${slug}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ content }),
	});
	const data = await response.json();
	return data as Post;
};

export const clientCreatePost = async (slug: string, content: string) => {
	const response = await fetch("/api/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ slug, content }),
	});
	const data = await response.json();
	return data;
};

export const clientUploadFile = async (file: File) => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch("/api/files", {
		method: "POST",
		body: formData,
	});
	const data = await response.json();
	return data as { url: string };
};
