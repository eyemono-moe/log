import { GHOST_API_KEY } from "astro:env/server";
import { fetchTrapArticles } from "./trap";
import { fetchZennArticles } from "./zenn";

export const getArticles = async () => {
	const ghostApiKey = GHOST_API_KEY;

	if (!ghostApiKey) {
		throw new Error("GHOST_API_KEY is not set");
	}

	const articles = await Promise.all([
		// fetchZennArticles(),
		// fetchTrapArticles(ghostApiKey),
	]).then((articles) => articles.flat());

	return articles;
};
