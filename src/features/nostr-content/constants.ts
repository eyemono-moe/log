/**
 * Nostrコンテンツ機能で使用する定数
 */

export const NOSTR_CONTENT = {
	// ファイル拡張子
	IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
	VIDEO_EXTENSIONS: [".mp4", ".webm", ".ogg", ".mov"],

	// 正規表現パターン
	MENTION_REGEX: /(?:nostr:)?((note|npub|naddr|nevent|nprofile)1\w+)/g,
	HASHTAG_REGEX_IGNORE_TAG: /(?<=\s|^)#(\S+)/g,
} as const;
