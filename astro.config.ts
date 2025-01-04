import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel";
import { defineConfig, envField } from "astro/config";
import auth from "auth-astro";
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
		auth(),
	],
	env: {
		schema: {
			GHOST_API_KEY: envField.string({
				context: "server",
				access: "secret",
			}),
			CONTENTFUL_SPACE_ID: envField.string({
				context: "server",
				access: "public",
			}),
			AUTH_SECRET: envField.string({
				context: "server",
				access: "secret",
			}),
			CONTENTFUL_CLIENT_ID: envField.string({
				context: "server",
				access: "secret",
			}),
			CONTENTFUL_CLIENT_SECRET: envField.string({
				context: "server",
				access: "secret",
			}),
			CONTENTFUL_REDIRECT_URI: envField.string({
				context: "server",
				access: "public",
			}),
		},
	},
	markdown: {
		remarkPlugins: [remarkModifiedTime],
		rehypePlugins: rehypePlugins,
	},
	adapter: vercel(),
});
