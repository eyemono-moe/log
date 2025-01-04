import {
	CONTENTFUL_CLIENT_ID,
	CONTENTFUL_CLIENT_SECRET,
	CONTENTFUL_REDIRECT_URI,
} from "astro:env/server";
import { defineConfig } from "auth-astro";
import { ContentfulProvider } from "./src/libs/cms/contentful/authProvider";

export default defineConfig({
	providers: [
		ContentfulProvider({
			clientId: CONTENTFUL_CLIENT_ID,
			clientSecret: CONTENTFUL_CLIENT_SECRET,
			redirectUri: CONTENTFUL_REDIRECT_URI,
		}),
	],
	callbacks: {
		jwt: async ({ token, account }) => {
			if (account?.access_token) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
});
