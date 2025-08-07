/**
 * リッチリンク機能の型定義
 */

// Twitter Widget API
export interface TwitterWidgetAPI {
	widgets: {
		load(el?: HTMLElement): void;
	};
}

declare global {
	interface Window {
		twttr?: TwitterWidgetAPI;
	}
}
