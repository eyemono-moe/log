import { defineConfig } from "astro/config";
import rehypeExternalLinks, { type Options } from "rehype-external-links";
import UnoCSS from "unocss/astro";
import { remarkModifiedTime } from "./src/plugins/remark-modified-time";

// https://astro.build/config
export default defineConfig({
	integrations: [
		UnoCSS({
			injectReset: true,
		}),
	],
	markdown: {
		remarkPlugins: [remarkModifiedTime],
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					content: {
						type: "raw",
						// @unocss-include
						value: `<div class="inline-block h-0.5lh w-auto aspect-square i-material-symbols:open-in-new-rounded"></div>`,
					},
				} satisfies Options,
			],
		],
	},
});
