// @ts-check
import { defineConfig } from "astro/config";
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
	},
});
