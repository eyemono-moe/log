import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import type { Component } from "solid-js";
import { unified } from "unified";
import { rehypePlugins } from "../../plugins/rehypePlugins";
import { previewInputSignal } from "../../store/previewInput";

const Preview: Component = () => {
	const [previewInput] = previewInputSignal;

	const preview = () => {
		return (
			unified()
				.use(remarkParse)
				.use(remarkRehype)
				// @ts-ignore: unifiedとastroの型が合わない
				.use(rehypePlugins)
				.use(rehypeStringify)
				.processSync(previewInput())
				.toString()
		);
	};

	return <div innerHTML={preview()} />;
};

export default Preview;
