import { type Component, createEffect, createSignal } from "solid-js";
import { createQueryGetPost } from "../../libs/query";
import { previewInputSignal } from "../../store/previewInput";
import Entries from "./Entries";
import MonacoEditor from "./MonacoEditor";

const EntryEditor: Component = () => {
	const [openedEntry, setOpenedEntry] = createSignal<string>();

	const p = createQueryGetPost(openedEntry);
	const [, setPreviewInput] = previewInputSignal;

	createEffect(() => {
		setPreviewInput(p.data?.content ?? "");
	});

	return (
		<div class="grid grid-cols-subgrid grid-col-span-2 h-full">
			<Entries handleSelectEntry={(slug) => setOpenedEntry(slug)} />
			<MonacoEditor />
		</div>
	);
};

export default EntryEditor;
