import * as cheerio from "cheerio";

export const extractText = (html: string): string => {
	const $ = cheerio.load(html);
	return $.text().trim();
};
