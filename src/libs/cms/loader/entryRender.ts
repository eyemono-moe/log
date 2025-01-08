import type { DataEntry, RenderedContent } from "astro:content";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { AstroConfig } from "astro";

export type Render = (entry: DataEntry) => Promise<RenderedContent>;

export const createEntryRender = async (
	markdownConfig: AstroConfig["markdown"],
): Promise<Render> => {
	const processor = await createMarkdownProcessor(markdownConfig);
	const render: Render = async (entry) => {
		if (!entry.body) {
			return {
				html: "",
			};
		}
		const result = await processor.render(entry.body, {
			frontmatter: entry.data,
		});
		return {
			html: result.code,
			metadata: result.metadata,
		};
	};

	return render;
};
