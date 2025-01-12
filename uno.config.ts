import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetUno,
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
		presetUno(),
		presetIcons({
			autoInstall: true,
		}),
		presetTypography(),
	],
	transformers: [transformerVariantGroup()],
	shortcuts: [
		{
			"bg-primary": "bg-white dark:bg-zinc-900",
			"text-link":
				"text-blue-7 visited:text-blue-9 dark:text-blue-4 dark:visited:text-blue-3 hover:underline",
			button:
				"w-full flex items-center justify-center gap-1 rounded-2 px-2 py-0.5 bg-accent-6 enabled:not-active:hover:bg-accent-7 enabled:active:bg-accent-8 disabled:op-50 text-white font-bold",
		},
	],
	theme: {
		colors,
		fontFamily: {
			sans: '"Noto Sans JP", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";',
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
