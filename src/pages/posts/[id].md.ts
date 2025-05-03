import { join } from "node:path";
import type { APIRoute } from "astro";
import { stringify } from "yaml";
import type { AstroPostEntry } from "../../content.config";
import { getPosts } from "../../utils/getPost";

export async function getStaticPaths() {
	const blogEntries = await getPosts();
	return blogEntries.map((entry) => ({
		params: { id: entry.id },
		props: { entry },
	}));
}

export const GET: APIRoute<{ entry: AstroPostEntry }> = async ({
	props,
	url,
}) => {
	const md = props.entry.body ?? "";

	// ローカル画像参照箇所をフルパスに変換
	const localImagePaths =
		(props.entry.rendered?.metadata?.localImagePaths as string[] | undefined) ??
		[];
	const localPathsMap = new Map(
		localImagePaths.map((path) => {
			const localFullPath = join(props.entry.filePath ?? "", path).replace(
				"src/public",
				"",
			);
			const remoteUrl = new URL(localFullPath, url);
			return [path, remoteUrl.toString()];
		}),
	);
	const replaced = md.replace(
		/!\[([^\]]*)\]\(([^)]+)\)/g,
		(match, alt, path) => {
			const replacedPath = localPathsMap.get(path);
			if (replacedPath) {
				return `![${alt}](${replacedPath})`;
			}
			return match;
		},
	);

	// frontmatterをyamlに変換して先頭に結合
	const frontmatter = stringify(props.entry.rendered?.metadata?.frontmatter);
	const joined = `---\n${frontmatter}---\n${replaced}`;

	return new Response(joined, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Access-Control-Allow-Origin": "*",
		},
	});
};
