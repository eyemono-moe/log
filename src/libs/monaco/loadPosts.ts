import { RegisteredMemoryFile } from "@codingame/monaco-vscode-files-service-override";
import type { Post } from "../cms";
import { fileSystemProvider } from "./setup.common";
import { createMemoryFileUri, createOriginalFileUri } from "./util/uri";

export const registerPostsFile = (posts: Post[]) => {
	return Promise.all(
		posts.map((post) => {
			fileSystemProvider.registerFile(
				new RegisteredMemoryFile(createMemoryFileUri(post), post.content),
			);
			fileSystemProvider.registerFile(
				new RegisteredMemoryFile(createOriginalFileUri(post), post.content),
			);
			console.log("registered", post.slug);
		}),
	);
};
