import type { Loader } from "astro/loaders";

export const CMSLoader = (): Loader => {
	return {
		name: "eyemono-cms-loader",
		load: async (ctx): Promise<void> => {},
	};
};
