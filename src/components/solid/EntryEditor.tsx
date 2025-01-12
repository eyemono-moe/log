import * as monaco from "monaco-editor";
import { type Component, For, createEffect } from "solid-js";
import { fetchPost } from "../../libs/query";
import {
	loadedModels,
	openedEntrySignal,
	openedModel,
} from "../../store/openedContents";
import Entries from "./Entries";
import MonacoEditor from "./MonacoEditor";

const EntryEditor: Component = () => {
	const [openedEntry, setOpenedEntry] = openedEntrySignal;

	createEffect(async () => {
		const slug = openedEntry();
		if (!slug || loadedModels.has(slug)) return;
		const post = await fetchPost(slug);

		const model = monaco.editor.createModel(
			post.content ?? "",
			"markdown",
			monaco.Uri.from({ scheme: "inmemory", path: slug }),
		);
		loadedModels.set(slug, model);
	});

	return (
		<div class="grid grid-cols-subgrid grid-col-span-2 h-full">
			<Entries handleSelectEntry={(slug) => setOpenedEntry(slug)} />
			<div class="grid grid-rows-[auto_minmax(0,1fr)] w-full overflow-hidden">
				<div class="flex overflow-x-auto w-full">
					<For each={Array.from(loadedModels.keys())}>
						{(slug) => (
							<button
								class="text-start text-sm w-full max-w-40 rounded-t px-2 py-1 hover:(bg-zinc-2/50 dark:bg-zinc-8/50) data-[opened]:(bg-zinc-2/50 dark:bg-zinc-8/50)"
								type="button"
								onClick={() => setOpenedEntry(slug)}
								data-opened={slug === openedEntry() ? "" : undefined}
							>
								<div class="truncate">{slug}</div>
							</button>
						)}
					</For>
				</div>
				<MonacoEditor openedModel={openedModel()} />
			</div>
		</div>
	);
};

export default EntryEditor;
