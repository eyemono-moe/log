import type { PostEntry } from "../content.config";

export const categoryText = (category: PostEntry["category"]) => {
	switch (category) {
		case "tech":
			return "モノヅクリ";
		case "idea":
			return "モノガタリ";
		default:
			return "その他";
	}
};
