import { RegisteredMemoryFile } from "@codingame/monaco-vscode-files-service-override";
import * as vscode from "vscode";
import type { Post } from "../cms";
import { fileSystemProvider } from "./setup.common";

export const registerPostsFile = (posts: Post[]) => {
	Promise.all(
		posts.map((post) => {
			fileSystemProvider.registerFile(
				new RegisteredMemoryFile(
					vscode.Uri.file(`/posts/${post.slug}.md`),
					post.content,
				),
			);
		}),
	);
};
