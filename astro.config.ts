import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";
import rehypeAutolinkHeadings, {
	type Options as AutoLinkOptions,
} from "rehype-autolink-headings";
import rehypeExternalLinks, {
	type Options as ExternalLinkOptions,
} from "rehype-external-links";
import rehypeSlug from "rehype-slug";
// @ts-ignore
import rlc from "remark-link-card";
import UnoCSS from "unocss/astro";
import Unfonts from "unplugin-fonts/astro";
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
		Unfonts({
			google: {
				families: [
					{
						name: "Noto Sans JP",
						styles: "wght@400;700",
					},
				],
			},
		}),
	],
	env: {
		schema: {
			GHOST_API_KEY: envField.string({
				context: "server",
				access: "secret",
				optional: false,
			}),
		},
	},
	markdown: {
		remarkPlugins: [remarkModifiedTime, [rlc, { cache: false }]],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					content: {
						type: "element",
						tagName: "span",
						properties: {
							// @unocss-include
							class:
								"inline-block h-1.6rem vertical-top translate-y-[calc((1lh-1.6rem)/2)] w-auto aspect-square i-material-symbols:link-rounded c-[--un-prose-lists] hover:c-accent-7 dark:hover:c-accent transition-color",
						},
						children: [],
					},
				} satisfies AutoLinkOptions,
			],
			[
				rehypeExternalLinks,
				{
					target: "_blank",
					rel: ["noopener", "noreferrer"],
					content: {
						type: "element",
						tagName: "span",
						properties: {
							// @unocss-include
							class:
								"inline-block h-0.5lh w-auto aspect-square i-material-symbols:open-in-new-rounded",
						},
						children: [],
					},
				} satisfies ExternalLinkOptions,
			],
		],
	},
});
