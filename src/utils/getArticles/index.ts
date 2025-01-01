import { fetchTrapArticles } from "./trap";
import { fetchZennArticles } from "./zenn";

export type Article = {
	source: "zenn.dev" | "trap.jp";
	url: string;
	title: string;
	imageUrl?: string;
	postedAt: Date;
};

export const getArticles = async () => {
	const ghostApiKey = import.meta.env.GHOST_API_KEY;

	if (!ghostApiKey) {
		throw new Error("GHOST_API_KEY is not set");
	}

	const articles = await Promise.all([
		fetchZennArticles(),
		fetchTrapArticles(ghostApiKey),
	]).then((articles) => articles.flat());

	return articles;
};
