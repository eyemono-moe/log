import { execSync } from "node:child_process";
import type { RemarkPlugins } from "astro";

export const remarkModifiedTime: RemarkPlugins[number] = () => {
	return (_, file) => {
		const filepath = file.history[0];
		const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
		if (file.data.astro?.frontmatter === undefined) {
			return;
		}
		file.data.astro.frontmatter.lastModified = result.toString();
	};
};

// declare module "astro:content" {
// 	interface RenderResult {
// 		remarkPluginFrontmatter: {
// 			lastModified?: string;
// 		};
// 	}
// }
