import { type Component, Show, createEffect } from "solid-js";
import { createMutationUpdatePost, fetchPost } from "../../libs/query";
import {
	closeModel,
	createModel,
	hasChangedMap,
	initialValues,
	loadedModels,
	openedEntrySignal,
	openedModel,
	resetInput,
} from "../../store/openedContents";
import Entries from "./Entries";
import MonacoEditor from "./MonacoEditor";

const EntryEditor: Component = () => {
	const [openedEntrySlug, setOpenedEntrySlug] = openedEntrySignal;

	createEffect(async () => {
		const slug = openedEntrySlug();
		if (!slug || loadedModels.has(slug)) return;
		const post = await fetchPost(slug);

		createModel(slug, post.content ?? "");
	});

	const updatePost = createMutationUpdatePost();
	const handleSave = async () => {
		const slug = openedEntrySlug();
		const model = openedModel();
		if (!slug || !model) return;
		const content = model.getValue();
		try {
			const updated = await updatePost.mutateAsync({ slug, content });
			initialValues.set(slug, updated.content);
			// TODO: use toast
			alert("保存しました");
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div class="grid grid-cols-subgrid grid-col-span-2 h-full">
			<Entries
				handleSelectEntry={(slug) => setOpenedEntrySlug(slug)}
				openedSlug={openedEntrySlug()}
			/>
			<div class="grid grid-rows-[auto_minmax(0,1fr)]">
				<div class="grid grid-cols-[minmax(0,1fr)_auto]">
					<div class="truncate">{openedEntrySlug()}</div>
					<div class="flex gap-1 items-center">
						<Show when={openedEntrySlug()}>
							<button
								type="button"
								class="button"
								onClick={() => {
									const slug = openedEntrySlug();
									if (!slug) return;
									(hasChangedMap.has(slug)
										? confirm("content has changed. close?")
										: true) && closeModel(slug);
								}}
								disabled={updatePost.isPending}
							>
								close
							</button>
							<button
								type="button"
								class="button"
								onClick={() => {
									confirm("reset?") && resetInput(openedEntrySlug() ?? "");
								}}
								disabled={
									updatePost.isPending ||
									!hasChangedMap.get(openedEntrySlug() ?? "")
								}
							>
								reset
							</button>
							<button
								type="button"
								class="button"
								onClick={handleSave}
								disabled={
									updatePost.isPending ||
									!hasChangedMap.get(openedEntrySlug() ?? "")
								}
							>
								save
							</button>
						</Show>
					</div>
				</div>
				<MonacoEditor openedModel={openedModel()} />
			</div>
		</div>
	);
};

export default EntryEditor;
