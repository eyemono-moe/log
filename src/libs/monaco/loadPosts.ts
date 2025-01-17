import { RegisteredMemoryFile } from "@codingame/monaco-vscode-files-service-override";
import type { FileSystemError } from "vscode";
import { clientGetPosts } from "../api";
import type { Post } from "../cms";
import { fileSystemProvider } from "./setup.common";
import { createMemoryFileUri, createOriginalFileUri } from "./util/uri";

const registerMemoryFile = async (post: Post) => {
	const memoryFileUri = createMemoryFileUri(post);
	try {
		await fileSystemProvider.stat(memoryFileUri);
		// 既に存在したら何もしない
		return;
	} catch (error) {
		if ((error as FileSystemError).code === "EntryNotFound") {
			// 存在しなかったら作成
			fileSystemProvider.registerFile(
				new RegisteredMemoryFile(memoryFileUri, post.content),
			);
			return;
		}
		console.error("Error registering memory file", error);
	}
};

const registerOrUpdateOriginalFile = async (post: Post) => {
	const originalFileUri = createOriginalFileUri(post);
	try {
		await fileSystemProvider.stat(originalFileUri);
		// 既に存在したら更新
		await fileSystemProvider.writeFile(
			originalFileUri,
			new TextEncoder().encode(post.content),
			{ create: true, overwrite: true, unlock: true, atomic: false },
		);
	} catch (error) {
		if ((error as FileSystemError).code === "EntryNotFound") {
			// 存在しなかったら作成
			fileSystemProvider.registerFile(
				new RegisteredMemoryFile(originalFileUri, post.content),
			);
			return;
		}
		console.error("Error updating original file", error);
	}
};

export const cloneRemoteContents = async () => {
	const posts = await clientGetPosts();
	// memoryFileとoriginalFileを更新
	return Promise.all(
		posts.map((post) => {
			registerMemoryFile(post);
			registerOrUpdateOriginalFile(post);
		}),
	);
};
