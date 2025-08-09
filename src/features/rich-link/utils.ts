import { RICH_LINK } from "./constants";

/**
 * TwitterまたはX.comのURLかどうかを判定
 */
export const isTwitterUrl = (url: string): boolean => {
	try {
		const host = new URL(url).hostname;
		return RICH_LINK.TWITTER_HOSTNAME.test(host);
	} catch {
		return false;
	}
};

/**
 * X.comのhostnameをtwitter.comに変換（Twitter Widget API対応）
 */
export const convertToDetectableTwitterUrl = (urlString: string): string => {
	try {
		const url = new URL(urlString);
		url.hostname = "twitter.com";
		return url.href;
	} catch {
		return urlString;
	}
};

/**
 * 相対URLを絶対URLに変換
 */
export const resolveUrl = (url: string, baseUrl: string): string => {
	if (url.startsWith("/")) {
		return new URL(url, baseUrl).href;
	}
	return url;
};
