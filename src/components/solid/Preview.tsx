import type { Component } from "solid-js";
import { extractFrontmatter } from "../../libs/extractFrontmatter";
import { previewRawValue } from "../../store/openedContents";
import Post from "./Post";
import PreviewHTML from "./PreviewHTML";

const Preview: Component = () => {
	const previewFrontmatter = () => extractFrontmatter(previewRawValue());

	return (
		<Post
			title={(previewFrontmatter().title as string | undefined) ?? "no title"}
			createdAt={
				(previewFrontmatter().createdAt as string | undefined) ??
				new Date().toISOString()
			}
			updatedAt={new Date().toISOString()}
			headings={[]}
		>
			<PreviewHTML />
		</Post>
	);
};

export default Preview;
