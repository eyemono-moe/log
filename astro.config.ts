import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import { defineConfig, envField } from "astro/config";
import expressiveCode from "astro-expressive-code";
import rehypeAutolinkHeadings, {
	type Options as AutoLinkOptions,
} from "rehype-autolink-headings";
import rehypeExternalLinks, {
	type Options as ExternalLinkOptions,
} from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
// @ts-ignore
import rlc from "remark-link-card";
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
		solidJs(),
		expressiveCode({
			styleOverrides: {
				frames: {
					frameBoxShadowCssValue: "",
					editorActiveTabIndicatorTopColor: "oklch(0.65 0.24 305)",
				},
			},
			themes: ["github-dark", "github-light"],
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
					properties: {
						class: "heading-link",
					},
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
			rehypeRaw,
			[
				rehypeExternalLinks,
				{
					target: "_blank",
					rel: ["noopener", "noreferrer"],
					// リンクカードでなければ外部リンクマークを付与
					content: (el) => {
						if (
							(el.properties?.className as string[] | undefined)?.includes(
								"rlc-container",
							)
						) {
							return;
						}
						return {
							type: "element",
							tagName: "span",
							properties: {
								// @unocss-include
								class:
									"inline-block h-0.5lh w-auto aspect-square i-material-symbols:open-in-new-rounded",
							},
							children: [],
						};
					},
				} satisfies ExternalLinkOptions,
			],
		],
	},
});
