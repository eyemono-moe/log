import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel";
import clerk from "@clerk/astro";
import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";
import { defineConfig, envField } from "astro/config";
import UnoCSS from "unocss/astro";
import { rehypePlugins } from "./src/plugins/rehypePlugins";

// https://astro.build/config
export default defineConfig({
	site: "https://log.eyemono.moe",
	image: {
		remotePatterns: [{ protocol: "https" }],
	},
	integrations: [
		solidJs(),
		UnoCSS({
			injectReset: true,
		}),
		sitemap(),
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
		clerk(),
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
			CONTENTFUL_ENVIRONMENT_ID: envField.string({
				context: "server",
				access: "public",
			}),
			CONTENTFUL_CMA_TOKEN: envField.string({
				context: "server",
				access: "secret",
			}),
			PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
				context: "client",
				access: "public",
			}),
			CLERK_SECRET_KEY: envField.string({
				context: "server",
				access: "secret",
			}),
		},
	},
	markdown: {
		rehypePlugins: rehypePlugins,
	},
	adapter: vercel(),
	vite: {
		plugins: [vsixPlugin()],
	},
});
