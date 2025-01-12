import rehypeStringify from "rehype-stringify";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import yaml from "yaml";
import { rehypePlugins } from "../plugins/rehypePlugins";
import { previewRawValue } from "./openedContents";

export const previewParseResult = () => {
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
		.processSync(previewRawValue());

	return result;
};
