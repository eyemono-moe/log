import * as vscode from "vscode";
import type { Post } from "../../cms";

export const createMemoryFileUri = (post: Post) =>
	vscode.Uri.from({
		scheme: "file",
		path: `/posts/${post.slug}.md`,
	});
export const createOriginalFileUri = (post: Post) =>
	vscode.Uri.from({
		scheme: "file",
		path: `${post.slug}.md`,
	});

export const toOriginalFileUri = (uri: vscode.Uri) => {
	return vscode.Uri.from({
		scheme: "file",
		path: uri.path.replace(/^\/posts\//, ""),
	});
};

export const getSlugFromUri = (uri: vscode.Uri) => {
	return uri.path.replace(/^\/posts\//, "").replace(/\.md$/, "");
};
