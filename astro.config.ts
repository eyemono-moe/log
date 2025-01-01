import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeExternalLinks, { type Options } from "rehype-external-links";
import UnoCSS from "unocss/astro";
import { remarkModifiedTime } from "./src/plugins/remark-modified-time";

// https://astro.build/config
export default defineConfig({
	site: "https://log.eyemono.moe",
	integrations: [
		UnoCSS({
			injectReset: true,
		}),
		sitemap(),
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
	],
	markdown: {
		remarkPlugins: [remarkModifiedTime],
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					content: {
						type: "element",
						tagName: "div",
						properties: {
							// @unocss-include
							class:
								"inline-block h-0.5lh w-auto aspect-square i-material-symbols:open-in-new-rounded",
						},
						children: [],
					},
				} satisfies Options,
			],
		],
	},
});
