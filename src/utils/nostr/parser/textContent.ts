import * as linkify from "linkifyjs";
import { decode } from "nostr-tools/nip19";
import type { ImetaTag, Tag } from "./commonTag";

linkify.registerCustomProtocol("wss");

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const isImageUrl = (url: string) => {
	try {
		const path = new URL(url).pathname;
		const ext = path.split(".").pop();
		return ext && imageExtensions.includes(ext.toLowerCase());
	} catch {
		return false;
	}
};
const videoExtensions = ["mp4", "webm", "ogg"];
const isVideoUrl = (url: string) => {
	const ext = url.split(".").pop();
	return ext && videoExtensions.includes(ext.toLowerCase());
};

export type TextContent = {
	type: "text";
	content: string;
};
export type ImageContent = {
	type: "image";
	src: string;
	blurhash?: string;
	alt?: string;
	thumb?: string;
	size?: { width: number; height: number };
};
export type VideoContent = {
	type: "video";
	href: string;
};
export type LinkContent = {
	type: "link";
	href: string;
	content: string;
};
export type MentionContent = {
	type: "mention";
	pubkey: string;
	relay?: string;
};
export type QuoteByIDContent = {
	type: "quoteByID";
	id: string;
};
// ts-remove-unused-skip
export type QuoteByAddressContent = {
	type: "quoteByAddress";
	d: string;
	pubkey: string;
	kind: number;
};
export type HashtagContent = {
	type: "hashtag";
	tag: string;
};
export type EmojiContent = {
	type: "emoji";
	tag: string;
	url: string;
};

export type ParsedContent =
	| TextContent
	| ImageContent
	| VideoContent
	| LinkContent
	| MentionContent
	| QuoteByIDContent
	| QuoteByAddressContent
	| HashtagContent
	| EmojiContent;

// https://github.com/nostr-protocol/nips/blob/master/27.md

const mentionRegex = /(?:nostr:)?((note|npub|naddr|nevent|nprofile)1\w+)/g;

type Reference = {
	start: number;
	end: number;
} & (
	| {
			type: "quoteByID";
			value: {
				id: string;
			};
	  }
	| {
			type: "quoteByAddress";
			value: {
				d: string;
				pubkey: string;
				kind: number;
			};
	  }
	| {
			type: "hashtag";
			value: {
				tag: string;
			};
	  }
	| {
			type: "mention";
			value: {
				pubkey: string;
			};
	  }
	| {
			type: "emoji";
			value: {
				name: string;
				url: string;
			};
	  }
);

// TODO: refactor
const parseReferences = (
	text: string,
	tags: Tag[],
	ignoreHashtagTag?: boolean,
): Reference[] => {
	const refs: Reference[] = [];

	const emojiTags = tags.filter((tag) => tag.kind === "emoji");
	if (emojiTags.length > 0) {
		const emojiRegex = new RegExp(
			`:(${emojiTags
				.sort((a, b) => b.name.length - a.name.length)
				.map((tag) => tag.name)
				.join("|")}):`,
			"g",
		);
		const emojiUrlMap = new Map(
			emojiTags.map((tag) => [tag.name, tag.url] as const),
		);

		for (const match of text.matchAll(emojiRegex)) {
			const length = match[0].length;
			const start = match.index;
			const end = start + length;
			const emojiTag = match[1];
			const url = emojiUrlMap.get(emojiTag);

			if (emojiTag && url) {
				refs.push({
					start,
					end,
					type: "emoji",
					value: {
						name: emojiTag,
						url,
					},
				});
			}
		}
	}

	const hashtagTags = tags.filter((tag) => tag.kind === "t");
	const hashtagRegex = ignoreHashtagTag
		? /(?<=\s|^)#(\S+)/g
		: new RegExp(
				`#(${hashtagTags
					.sort((a, b) => b.tag.length - a.tag.length)
					.map((tag) => tag.tag)
					.join("|")})`,
				"g",
			);
	if (ignoreHashtagTag || hashtagTags.length > 0) {
		for (const match of text.matchAll(hashtagRegex)) {
			const length = match[0].length;
			const start = match.index;
			const end = start + length;
			const hashtag = match.at(1);

			if (hashtag) {
				refs.push({
					start,
					end,
					type: "hashtag",
					value: {
						tag: hashtag,
					},
				});
			}
		}
	}

	for (const match of text.matchAll(mentionRegex)) {
		const length = match[0].length;
		const start = match.index;
		const end = start + length;
		const bech32 = match.at(1);

		if (bech32) {
			try {
				const { data, type } = decode(bech32);
				switch (type) {
					case "note":
						refs.push({
							start,
							end,
							type: "quoteByID",
							value: {
								id: data,
							},
						});
						break;
					case "npub":
						refs.push({
							start,
							end,
							type: "mention",
							value: {
								pubkey: data,
							},
						});
						break;
					case "nprofile":
						refs.push({
							start,
							end,
							type: "mention",
							value: {
								pubkey: data.pubkey,
							},
						});
						break;
					case "nevent":
						refs.push({
							start,
							end,
							type: "quoteByID",
							value: {
								id: data.id,
							},
						});
						break;
					case "naddr":
						refs.push({
							start,
							end,
							type: "quoteByAddress",
							value: {
								d: data.identifier,
								kind: data.kind,
								pubkey: data.pubkey,
							},
						});
				}
			} catch {
				// 不正なhexの場合は無視
			}
		}
	}
	return refs;
};

export const parseTextContent = (
	content: string,
	tags: Tag[],
	_ignoreHashtagTag?: boolean,
) => {
	try {
		const references = parseReferences(content, tags, true);
		const imetaTags = tags.filter((tag) => tag.kind === "imeta");
		const spitedContent = splitTextByLinks(content, references, imetaTags);
		return spitedContent;
	} catch (e) {
		console.error("failed to parse contents: ", e);
		return [
			{
				type: "text" as const,
				content,
			},
		];
	}
};

const splitTextByLinks = (
	text: string,
	refs: Reference[],
	imetaTags: ImetaTag[],
): ParsedContent[] => {
	// TODO: r tagに含まれるリンクのみをリンクとして認識する
	const links = linkify
		.find(text, {
			validate: {
				// schemeを持つURLのみをリンクとして認識する
				url: (value) => /^(?:https?|wss?):\/\//.test(value),
			},
		})
		.filter((link) => link.type === "url");

	const sortedLinkOrRefs = [...links, ...refs].sort(
		(a, b) => a.start - b.start,
	);

	const parsedContent: ParsedContent[] = [];
	let lastIdx = 0;
	for (const linkOrRef of sortedLinkOrRefs) {
		const { start, end } = linkOrRef;
		if (start > lastIdx) {
			parsedContent.push({
				type: "text",
				content: text.slice(lastIdx, start),
			});
		}

		const matchedContent = text.slice(start, end);
		if (isRef(linkOrRef)) {
			switch (linkOrRef.type) {
				case "mention":
					parsedContent.push({
						type: "mention",
						pubkey: linkOrRef.value.pubkey,
					});
					break;
				case "quoteByID":
					parsedContent.push({
						type: "quoteByID",
						id: linkOrRef.value.id,
					});
					break;
				case "quoteByAddress":
					parsedContent.push({
						type: "quoteByAddress",
						d: linkOrRef.value.d,
						pubkey: linkOrRef.value.pubkey,
						kind: linkOrRef.value.kind,
					});
					break;
				case "hashtag":
					parsedContent.push({
						type: "hashtag",
						tag: linkOrRef.value.tag,
					});
					break;
				case "emoji":
					parsedContent.push({
						type: "emoji",
						tag: linkOrRef.value.name,
						url: linkOrRef.value.url,
					});
					break;
				default: {
					const _unreachable: never = linkOrRef;
					throw new Error(`Unknown ref type: ${_unreachable}`);
				}
			}
		} else {
			if (isImageUrl(matchedContent)) {
				const imetaTag = imetaTags.find((tag) => tag.url === matchedContent);

				parsedContent.push({
					type: "image",
					src: matchedContent,
					blurhash: imetaTag?.blurhash,
					alt: imetaTag?.alt,
					thumb: imetaTag?.thumb,
					size: imetaTag?.dim
						? {
								width: Number(imetaTag.dim.split("x")[0]),
								height: Number(imetaTag.dim.split("x")[1]),
							}
						: undefined,
				});
			} else if (isVideoUrl(matchedContent)) {
				parsedContent.push({
					type: "video",
					href: matchedContent,
				});
			} else {
				parsedContent.push({
					type: "link",
					href: linkOrRef.href,
					content: text.slice(start, end),
				});
			}
		}

		lastIdx = end;
	}

	if (lastIdx < text.length) {
		parsedContent.push({
			type: "text",
			content: text.slice(lastIdx),
		});
	}

	return parsedContent;
};

const isRef = (
	ref: Reference | ReturnType<typeof linkify.find>[number],
): ref is ReturnType<typeof parseReferences>[number] => {
	return !("href" in ref);
};

export const parsedContents2Tags = (
	parsedContents: ParsedContent[],
): string[][] => {
	const tags: string[][] = [];
	for (const parsedContent of parsedContents) {
		switch (parsedContent.type) {
			case "text":
			case "image":
			case "video":
				// do nothing
				break;
			case "emoji":
				tags.push(["emoji", parsedContent.tag, parsedContent.url]);
				break;
			case "quoteByID":
				// TODO: get relay, pubkey from cache
				tags.push(["q", parsedContent.id]);
				break;
			case "quoteByAddress":
				// TODO: get event id from cache or fetch
				break;
			case "hashtag":
				tags.push(["t", parsedContent.tag]);
				break;
			case "mention":
				// TODO: get relay from cache
				tags.push(["p", parsedContent.pubkey]);
				break;
			case "link":
				tags.push(["r", parsedContent.href]);
				break;
			default: {
				const _unreachable: never = parsedContent;
				throw new Error(`Unknown parsed content type: ${_unreachable}`);
			}
		}
	}
	return tags;
};
