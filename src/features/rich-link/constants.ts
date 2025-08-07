/**
 * リッチリンク機能で使用する定数
 */

export const RICH_LINK = {
	// サイト情報
	SITE_FAVICON_URL: "https://www.google.com/s2/favicons?domain=log.eyemono.moe",
	SITE_FAVICON_ALT: "eyemono.log favicon",

	// 外部API
	CORS_PROXY: "https://corsproxy.io/",

	// 正規表現
	TWITTER_HOSTNAME: /(\.)?(twitter|x)\.com/i,
	CHARSET_UTF8: /charset=utf-8/i,
	URL_WITH_SCHEME: /^(?:https?|wss?):\/\//,
} as const;

// oEmbed プロバイダー設定
export const OEMBED_PROVIDERS = [
	{
		name: "youtube",
		patterns: [
			"https?://.*\\.youtube\\.com/watch.*",
			"https?://.*\\.youtube\\.com/v/.*",
			"https?://youtu\\.be/.*",
			"https?://.*\\.youtube\\.com/playlist\\?list=.*",
		],
		endpoint: "https://www.youtube.com/oembed",
	},
	{
		name: "spotify",
		patterns: ["https?://open\\.spotify\\.com/.*", "spotify:.*"],
		endpoint: "https://open.spotify.com/oembed",
	},
] as const;
