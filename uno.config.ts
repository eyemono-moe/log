import presetWind3 from "@unocss/preset-wind3";
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetWebFonts,
	transformerVariantGroup,
} from "unocss";

interface Colors {
	[key: string]: (Colors & { DEFAULT?: string }) | string;
}

const colors: Colors = {
	// l: unocssのgray系を除いた色のlの平均値
	// c: unocssのgray系を除いた色のcの平均値を大きめに調整した値
	// see: https://github.com/unocss/unocss/blob/75fd665273ff7f2ffb16be8841f7fcd89c9b27a5/packages/preset-mini/src/_theme/colors.ts#L15-L327
	accent: {
		50: "oklch(0.95 0.02 305 / <alpha-value>)",
		305: "oklch(0.93 0.05 305 / <alpha-value>)",
		200: "oklch(0.89 0.09 305 / <alpha-value>)",
		300: "oklch(0.83 0.14 305 / <alpha-value>)",
		400: "oklch(0.74 0.20 305 / <alpha-value>)",
		500: "oklch(0.65 0.24 305 / <alpha-value>)",
		600: "oklch(0.57 0.23 305 / <alpha-value>)",
		700: "oklch(0.49 0.22 305 / <alpha-value>)",
		800: "oklch(0.42 0.19 305 / <alpha-value>)",
		900: "oklch(0.37 0.15 305 / <alpha-value>)",
		950: "oklch(0.27 0.11 305 / <alpha-value>)",
	},
};

// assign default color and add color shortcuts
for (const color of Object.values(colors)) {
	if (typeof color !== "string" && color !== undefined) {
		color.DEFAULT = color.DEFAULT || (color[400] as string);
		for (const key of Object.keys(color)) {
			const short = +key / 100;
			if (short === Math.round(short)) {
				color[short] = color[key];
			}
		}
	}
}

export default defineConfig({
	content: {
		filesystem: ["astro.config.ts"],
	},
	presets: [
		presetWind3(),
		presetIcons({
			autoInstall: true,
		}),
		presetTypography(),
		presetWebFonts(),
	],
	transformers: [transformerVariantGroup()],
	shortcuts: [
		{
			"bg-primary": "bg-white dark:bg-zinc-900",
			"bg-secondary": "bg-zinc-50 dark:bg-zinc-8",
			"text-link":
				"text-blue-7 visited:text-blue-9 dark:text-blue-4 dark:visited:text-blue-3 underline",
			"toc-link":
				"line-clamp-3 decoration-none op-70 hover:op-100 transition-color-200",
			"toc-link-active": "dark:c-accent c-accent-7 op-100",
			"toc-is-collapsed": "hidden",
			"b-zinc-auto": "b-zinc-2 dark:b-zinc-7",
			"c-primary": "c-zinc-950 dark:c-zinc-1",
			"c-secondary": "c-zinc-5 dark:c-zinc-4",
			"rlc-container":
				"decoration-none c-primary w-full b-1 b-zinc-auto rounded-2 flex h-30 justify-between overflow-hidden hover:bg-zinc-50 dark:hover:bg-zinc-8/50 transition-[background-color] @container my-2",
			"rlc-info":
				"flex flex-col justify-between px-2 md:px-4 py-2 overflow-hidden",
			"rlc-title": "truncate text-lg",
			"rlc-description": "line-clamp-2 text-sm c-secondary",
			"rlc-url-container": "flex items-center gap-1",
			"rlc-favicon": "w-16px h-auto aspect-square shrink-0",
			"rlc-url": "truncate text-sm text-link",
			"rlc-image-container":
				"flex h-full w-auto max-w-50cqw shrink-0 overflow-hidden",
			"rlc-image": "object-cover w-full h-full",
		},
	],
	theme: {
		colors,
		font: {
			sans: '"Noto Sans JP",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
		},
	},
	preflights: [
		{
			getCSS: () => `
		.prose :where(ol,ul) :where(ol,ul):not(:where(.not-prose,.not-prose *)) {
			margin-block: 0.25em !important;
		}
		html {
			scroll-padding-top: 4rem;
		}
		`,
		},
	],
});
