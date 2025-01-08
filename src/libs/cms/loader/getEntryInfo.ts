import { parseFrontmatter } from "@astrojs/markdown-remark";

export const getEntryInfo = (
	contents: string,
): {
	data: Record<string, unknown>;
	body: string;
} => {
	const parsed = parseFrontmatter(contents);
	return {
		data: parsed.frontmatter,
		body: parsed.content.trim(),
	};
};
