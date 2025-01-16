import type { Component } from "solid-js";
import MonacoEditor from "./MonacoEditor";

const EntryEditor: Component = () => {
	// const [openedEntrySlug, setOpenedEntrySlug] = openedEntrySignal;

	// createEffect(async () => {
	// 	const slug = openedEntrySlug();
	// 	if (!slug || loadedModelRefs.has(slug)) return;
	// 	const post = await fetchPost(slug);

	// 	await createModel(slug, post.content ?? "");
	// });

	// const updatePost = createMutationUpdatePost();
	// const handleSave = async () => {
	// 	const slug = openedEntrySlug();
	// 	const model = openedModel();
	// 	if (!slug || !model) return;
	// 	const content = model.getValue();
	// 	try {
	// 		const updated = await updatePost.mutateAsync({ slug, content });
	// 		initialValues.set(slug, updated.content);
	// 		// TODO: use toast
	// 		alert("保存しました");
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// };

	// const createPost = createMutationCreatePost();
	// const handleCreatePost = () => {
	// 	// TODO: use modal
	// 	const slug = prompt("Enter slug", randomSlugWithDatePrefix());
	// 	if (!slug || !isValidSlug(slug)) return;
	// 	createPost.mutateAsync({ slug, content: postTemplate });
	// };

	return <MonacoEditor />;
};

export default EntryEditor;
