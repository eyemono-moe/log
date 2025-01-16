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
		path: `/cms/${post.slug}.md`,
	});

export const toOriginalFileUri = (uri: vscode.Uri) => {
	// TODO:  workspace.asRelativePath(uri.fsPath) など使う
	return vscode.Uri.from({
		scheme: "file",
		path: uri.path.replace(/^\/posts/, "/cms"),
	});
};
