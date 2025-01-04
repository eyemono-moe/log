import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";

// https://www.contentful.com/developers/docs/references/user-management-api/#/reference/users
interface ContentfulProfile {
	firstName: string;
	lastName: string;
	avatarUrl: string;
	email: string;
	activated: boolean;
	signInCount: number;
	confirmed: boolean;
	"2faEnabled": boolean;
	sys: {
		type: string;
		id: string;
		version: number;
		createdAt: string;
		updatedAt: string;
	};
}

export const ContentfulProvider = (
	config: OAuthUserConfig<ContentfulProfile> & {
		redirectUri: string;
	},
): OAuthConfig<ContentfulProfile> => {
	return {
		id: "contentful",
		name: "Contentful",
		type: "oauth",
		authorization: {
			url: "https://be.contentful.com/oauth/authorize",
			params: {
				client_id: config.clientId,
				redirect_uri: config.redirectUri,
				scope: "content_management_manage",
			},
		},
		token: {
			url: "https://be.contentful.com/oauth/token",
			params: {
				redirect_uri: config.redirectUri,
			},
		},
		userinfo: "https://api.contentful.com/users/me",
		profile: (profile) => ({
			id: profile.sys.id,
			email: profile.email,
			name: `${profile.firstName} ${profile.lastName}`,
			image: profile.avatarUrl,
		}),
		options: config,
	};
};
