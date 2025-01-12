// 小文字英数字とハイフンのみで10文字以上50文字以下
export const validSlugRegex = /^[a-z0-9-]{10,50}$/;

export const isValidSlug = (slug: string) => validSlugRegex.test(slug);

const genRandomSlug = () => {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	const length = 10;
	return Array.from({ length })
		.map(() => chars[Math.floor(Math.random() * chars.length)])
		.join("");
};

export const randomSlugWithDatePrefix = () => {
	const date = new Date();
	const prefix = `${(date.getFullYear() % 100).toString().padStart(2, "0")}${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
	return `${prefix}-${genRandomSlug()}`;
};
