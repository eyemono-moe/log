import * as monaco from "monaco-editor";
import { type Component, For, Show, createEffect } from "solid-js";
import { createMutationUpdatePost, fetchPost } from "../../libs/query";
import {
	createModel,
	hasChanged,
	initialValues,
	loadedModels,
	openedEntrySignal,
	openedModel,
	resetInput,
} from "../../store/openedContents";
import Entries from "./Entries";
import MonacoEditor from "./MonacoEditor";

const EntryEditor: Component = () => {
	const [openedEntry, setOpenedEntry] = openedEntrySignal;

	createEffect(async () => {
		const slug = openedEntry();
		if (!slug || loadedModels.has(slug)) return;
		const post = await fetchPost(slug);

		createModel(slug, post.content ?? "");
	});

	const updatePost = createMutationUpdatePost();
	const handleSave = async () => {
		const slug = openedEntry();
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
			<Entries handleSelectEntry={(slug) => setOpenedEntry(slug)} />
			<div class="grid grid-rows-[auto_minmax(0,1fr)]">
				<div class="grid grid-cols-[minmax(0,1fr)_auto]">
					<div class="truncate">{openedEntry()}</div>
					<div class="flex gap-1 items-center">
						<Show when={openedEntry()}>
							<button
								type="button"
								class="button"
								onClick={() => {
									confirm("reset?") && resetInput();
								}}
								disabled={updatePost.isPending || !hasChanged()}
							>
								reset
							</button>
							<button
								type="button"
								class="button"
								onClick={handleSave}
								disabled={updatePost.isPending || !hasChanged()}
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
