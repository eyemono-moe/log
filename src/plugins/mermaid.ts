// Mermaid の図はビルド時にブラウザを使わず、`pnpm mermaid` でローカル生成した SVG を参照する。
// 図の中身のハッシュをファイル名にするので、図を変えたら `pnpm mermaid` を実行してコミットする。
import { createHash } from "node:crypto";
import { existsSync, globSync, readFileSync } from "node:fs";
import type { AstroIntegration, RehypePlugins } from "astro";

export const CONTENT_GLOB = "src/content/**/*.md";
export const SVG_DIR = "public/mermaid";
export const MANIFEST_PATH = "src/plugins/mermaid-manifest.json";
const PUBLIC_PATH = "/mermaid";

export type ColorScheme = "light" | "dark";
export type ManifestEntry = {
	width: number;
	height: number;
	description?: string;
};
export type Manifest = Record<string, Record<ColorScheme, ManifestEntry>>;

const normalize = (diagram: string) => diagram.replace(/\r\n/g, "\n").trim();

export const mermaidHash = (diagram: string) =>
	createHash("sha256").update(normalize(diagram)).digest("hex").slice(0, 16);

export const svgFileName = (hash: string, scheme: ColorScheme) =>
	`${hash}-${scheme}.svg`;

export const readManifest = (): Manifest =>
	existsSync(MANIFEST_PATH)
		? JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"))
		: {};

/** Markdown 中の ```mermaid ブロックを集める。key は図のハッシュ */
export const collectDiagrams = () => {
	const diagrams = new Map<string, { diagram: string; files: string[] }>();
	const fence = /^([ \t]*)```mermaid[^\n]*\n([\s\S]*?)^[ \t]*```[ \t]*$/gm;
	for (const file of globSync(CONTENT_GLOB)) {
		const source = readFileSync(file, "utf-8").replace(/\r\n/g, "\n");
		for (const [, indent, body] of source.matchAll(fence)) {
			const diagram = normalize(
				body
					.split("\n")
					.map((line) =>
						line.startsWith(indent) ? line.slice(indent.length) : line,
					)
					.join("\n"),
			);
			const hash = mermaidHash(diagram);
			const entry = diagrams.get(hash) ?? { diagram, files: [] };
			entry.files.push(file);
			diagrams.set(hash, entry);
		}
	}
	return diagrams;
};

type HastNode = {
	type: string;
	tagName?: string;
	value?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

const textOf = (node: HastNode): string =>
	node.type === "text"
		? (node.value ?? "")
		: (node.children ?? []).map(textOf).join("");

const hasClass = (node: HastNode, name: string) => {
	const className = node.properties?.className;
	return Array.isArray(className) && className.includes(name);
};

/** `<pre><code class="language-mermaid">` を探し、中身の図のテキストを返す */
const mermaidSource = (node: HastNode) => {
	if (node.type !== "element" || node.tagName !== "pre") return;
	const elements = (node.children ?? []).filter((c) => c.type === "element");
	const code = elements[0];
	if (
		elements.length !== 1 ||
		code.tagName !== "code" ||
		!hasClass(code, "language-mermaid")
	) {
		return;
	}
	return textOf(code);
};

const toPicture = (hash: string, entry: Manifest[string]): HastNode => ({
	type: "element",
	tagName: "picture",
	properties: {},
	children: [
		{
			type: "element",
			tagName: "source",
			properties: {
				media: "(prefers-color-scheme: dark)",
				srcset: `${PUBLIC_PATH}/${svgFileName(hash, "dark")}`,
				width: entry.dark.width,
				height: entry.dark.height,
			},
			children: [],
		},
		{
			type: "element",
			tagName: "img",
			properties: {
				src: `${PUBLIC_PATH}/${svgFileName(hash, "light")}`,
				alt: entry.light.description ?? "",
				width: entry.light.width,
				height: entry.light.height,
				loading: "lazy",
			},
			children: [],
		},
	],
});

export const rehypeMermaidPrerendered: RehypePlugins[number] = () => {
	return (tree) => {
		const manifest = readManifest();
		const visit = (node: HastNode) => {
			const children = node.children ?? [];
			for (const [index, child] of children.entries()) {
				const source = mermaidSource(child);
				if (source === undefined) {
					visit(child);
					continue;
				}
				const hash = mermaidHash(source);
				const entry = manifest[hash];
				if (!entry) {
					throw new Error(
						`Mermaid の SVG がありません (${hash})。\`pnpm mermaid\` を実行してください。`,
					);
				}
				children[index] = toPicture(hash, entry);
			}
		};
		visit(tree as HastNode);
	};
};

/**
 * 記事のレンダリング中のエラーは Astro がログに出すだけでビルドは成功してしまうので、
 * SVG が足りないときはビルド開始時点で落とす。
 */
export const mermaidCheck = (): AstroIntegration => ({
	name: "mermaid-check",
	hooks: {
		"astro:config:setup": ({ command }) => {
			if (command !== "build") return;
			const manifest = readManifest();
			const missing = [...collectDiagrams()].filter(
				([hash]) =>
					!manifest[hash] ||
					!existsSync(`${SVG_DIR}/${svgFileName(hash, "light")}`) ||
					!existsSync(`${SVG_DIR}/${svgFileName(hash, "dark")}`),
			);
			if (missing.length > 0) {
				const files = [...new Set(missing.flatMap(([, { files }]) => files))];
				throw new Error(
					`Mermaid の SVG が生成されていない図があります (${files.join(", ")})。\`pnpm mermaid\` を実行してコミットしてください。`,
				);
			}
		},
	},
});
