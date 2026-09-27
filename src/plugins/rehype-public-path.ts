import type { RehypePlugins } from "astro";

// Front Matter CMS は `<video src="../../../public/media/...">` のように public への相対パスで挿入する。
// Markdown の画像記法と違って生の HTML の src は Astro が解決しないので、公開パスに書き換える。
const PUBLIC_PREFIX = /^(?:\.\.\/)+public\//;
const ATTRIBUTES = ["src", "poster"] as const;

type HastNode = {
	type: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

export const rehypePublicPath: RehypePlugins[number] = () => {
	return (tree) => {
		const visit = (node: HastNode) => {
			const properties = node.properties ?? {};
			for (const attribute of ATTRIBUTES) {
				const value = properties[attribute];
				if (typeof value === "string" && PUBLIC_PREFIX.test(value)) {
					properties[attribute] = encodeURI(
						`/${decodeURI(value.replace(PUBLIC_PREFIX, ""))}`,
					);
				}
			}
			for (const child of node.children ?? []) {
				visit(child);
			}
		};
		visit(tree as HastNode);
	};
};
