import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import { defineConfig, envField } from "astro/config";
import rehypeAutolinkHeadings, {
	type Options as AutoLinkOptions,
} from "rehype-autolink-headings";
import rehypeExternalLinks, {
	type Options as ExternalLinkOptions,
} from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import UnoCSS from "unocss/astro";
import { rehypePlugins } from "./src/plugins/rehypePlugins";
import { remarkModifiedTime } from "./src/plugins/remark-modified-time";

// https://astro.build/config
export default defineConfig({
	site: "https://log.eyemono.moe",
	image: {
		remotePatterns: [{ protocol: "https" }],
	},
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
		remarkPlugins: [remarkModifiedTime],
		rehypePlugins: rehypePlugins,
	},
});
