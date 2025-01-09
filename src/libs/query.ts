import {
	createMutation,
	createQuery,
	useQueryClient,
} from "@tanstack/solid-query";
import {
	clientCreatePost,
	clientGetPost,
	clientGetPosts,
	clientUpdatePost,
	clientUploadFile,
} from "./api";

export const createQueryGetPost = (slug: () => string | undefined) =>
	createQuery(() => ({
		queryKey: ["posts", slug()],
		queryFn: () => clientGetPost(slug() ?? ""),
		enabled: !!slug(),
	}));

export const createQueryGetPosts = () =>
	createQuery(() => ({
		queryKey: ["posts"],
		queryFn: () => clientGetPosts(),
	}));

export const createMutationUpdatePost = () => {
	const queryClient = useQueryClient();
	return createMutation(() => ({
		mutationFn: ({ slug, content }: { slug: string; content: string }) =>
			clientUpdatePost(slug, content),
		onSuccess: (_, { slug }) => {
			queryClient.invalidateQueries({
				queryKey: ["posts", slug],
			});
		},
	}));
};

export const createMutationCreatePost = () => {
	const queryClient = useQueryClient();
	return createMutation(() => ({
		mutationFn: ({ slug }: { slug: string }) => clientCreatePost(slug),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["posts"],
			});
		},
	}));
};

export const createMutationUploadFile = () => {
	return createMutation(() => ({
		mutationFn: ({ file }: { file: File }) => clientUploadFile(file),
	}));
};
