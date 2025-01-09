import rehypeStringify from "rehype-stringify";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { createSignal } from "solid-js";
import { unified } from "unified";
import yaml from "yaml";
import { rehypePlugins } from "../plugins/rehypePlugins";

export const previewInputSignal = createSignal<string>("");

export const parseResult = () => {
	const result = unified()
		.use(remarkParse)
		.use(remarkFrontmatter, {
			type: "yaml",
			marker: "-",
		})
		.use(remarkExtractFrontmatter, {
			name: "frontmatter",
			yaml: yaml.parse,
		})
		.use(remarkRehype)
		// @ts-ignore: unifiedとastroの型が合わない
		.use(rehypePlugins)
		.use(rehypeStringify)
		.processSync(previewInputSignal[0]());

	return result;
};
