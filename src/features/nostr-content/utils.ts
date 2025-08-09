import { NOSTR_CONTENT } from "./constants";

/**
 * 画像URLかどうかを判定
 */
export const isImageUrl = (url: string): boolean => {
	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname.toLowerCase();
		return NOSTR_CONTENT.IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext));
	} catch {
		return false;
	}
};

/**
 * 動画URLかどうかを判定
 */
export const isVideoUrl = (url: string): boolean => {
	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname.toLowerCase();
		return NOSTR_CONTENT.VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
	} catch {
		return false;
	}
};
