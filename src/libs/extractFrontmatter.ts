import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { type Processor, unified } from "unified";
import yaml from "yaml";

function noopCompiler(this: Processor) {
	this.compiler = () => {
		return "";
	};
}

export const extractFrontmatter = (code: string): Record<string, unknown> => {
	return unified()
		.use(remarkParse)
		.use(remarkFrontmatter, {
			type: "yaml",
			marker: "-",
		})
		.use(remarkExtractFrontmatter, {
			name: "frontmatter",
			yaml: yaml.parse,
		})
		.use(noopCompiler)
		.processSync(code).data.frontmatter as Record<string, unknown>;
};
