export type Post = {
	slug: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export interface CMSClient {
	getPost: (slug: string) => Promise<Post>;
	getPosts: (filter?: {
		// filter posts created/modified after this date
		after?: Date;
	}) => Promise<Post[]>;
	updatePost: (slug: string, content: string) => Promise<Post>;
	/** create empty post */
	createPost: (slug: string, content: string) => Promise<Post>;
	/**
	 * upload file to storage
	 *
	 * @param file file to upload
	 * @returns url of uploaded file
	 */
	uploadFile: (file: File) => Promise<string>;
}
