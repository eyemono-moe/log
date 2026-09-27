// 記事中の Mermaid の図をライト/ダークの SVG に描画して public/mermaid に書き出す。
// 使われなくなった SVG は削除する。`--force` を付けると全部描画し直す。
import {
	existsSync,
	mkdirSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { createMermaidRenderer } from "mermaid-isomorphic";
import {
	type ColorScheme,
	collectDiagrams,
	MANIFEST_PATH,
	type Manifest,
	readManifest,
	SVG_DIR,
	svgFileName,
} from "../src/plugins/mermaid.ts";

const force = process.argv.includes("--force");
const schemes: ColorScheme[] = ["light", "dark"];

const diagrams = collectDiagrams();
const oldManifest = readManifest();
const manifest: Manifest = {};

mkdirSync(SVG_DIR, { recursive: true });

const pending = [...diagrams].filter(
	([hash]) =>
		force ||
		!oldManifest[hash] ||
		schemes.some((s) => !existsSync(join(SVG_DIR, svgFileName(hash, s)))),
);
for (const [hash] of diagrams) {
	if (oldManifest[hash] && !pending.some(([h]) => h === hash)) {
		manifest[hash] = oldManifest[hash];
	}
}

if (pending.length > 0) {
	const render = createMermaidRenderer();
	const rendered: Partial<Manifest> = {};
	for (const scheme of schemes) {
		const results = await render(
			pending.map(([, { diagram }]) => diagram),
			{
				mermaidConfig: scheme === "dark" ? { theme: "dark" } : {},
				prefix: `mermaid-${scheme}`,
			},
		);
		for (const [index, result] of results.entries()) {
			const [hash, { files }] = pending[index];
			if (result.status === "rejected") {
				console.error(`Mermaid の描画に失敗しました (${files.join(", ")})`);
				throw result.reason;
			}
			const { svg, width, height, description } = result.value;
			writeFileSync(join(SVG_DIR, svgFileName(hash, scheme)), svg);
			rendered[hash] = {
				...rendered[hash],
				[scheme]: {
					width: Math.ceil(width),
					height: Math.ceil(height),
					description,
				},
			} as Manifest[string];
		}
	}
	Object.assign(manifest, rendered);
}

const used = new Set(
	[...diagrams.keys()].flatMap((hash) =>
		schemes.map((s) => svgFileName(hash, s)),
	),
);
const removed = readdirSync(SVG_DIR).filter((file) => !used.has(file));
for (const file of removed) {
	rmSync(join(SVG_DIR, file));
}

const sorted = Object.fromEntries(
	Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
);
writeFileSync(MANIFEST_PATH, `${JSON.stringify(sorted, null, "\t")}\n`);

console.log(
	`図 ${diagrams.size} 件: ${pending.length} 件を描画、${removed.length} 件の SVG を削除`,
);
